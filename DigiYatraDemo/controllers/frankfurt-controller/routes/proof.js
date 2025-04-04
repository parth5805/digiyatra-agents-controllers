const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const NavLinkService = require('../services/NavLinkService');
const navLinkService = new NavLinkService();
navLinkService.registerCustomLinks([
    { "label": "Proofs", "url": "/proofs" },
    { "label": "Request Proof", "url": "/proofs/request" }
]);

// const proofJSON = {
//     "comment": "This is a comment about the reason for the proof",
//     "connection_id": "<Enter a valid Connection ID>",
//     "presentation_request": {
//         "indy": {
//             "name": "Proof of Education",
//             "version": "1.0",
//             "requested_attributes": {
//                 "0_name_uuid": {
//                     "name": "name",
//                     "restrictions": [
//                         {
//                             "cred_def_id": "<Enter a valid Credential Definition ID>"
//                         }
//                     ]
//                 },
//                 "0_date_uuid": {
//                     "name": "date",
//                     "restrictions": [
//                         {
//                             "cred_def_id": "<Enter a valid Credential Definition ID>"
//                         }
//                     ]
//                 },
//                 "0_degree_uuid": {
//                     "name": "degree",
//                     "restrictions": [
//                         {
//                             "cred_def_id": "<Enter a valid Credential Definition ID>"
//                         }
//                     ]
//                 },
//                 "0_self_attested_thing_uuid": {
//                     "name": "self_attested_thing"
//                 }
//             },
//             "requested_predicates": {
//                 "0_age_GE_uuid": {
//                     "name": "birthdate_dateint",
//                     "p_type": ">=",
//                     "p_value": 18,
//                     "restrictions": [
//                         {
//                             "cred_def_id": "<Enter a valid Credential Definition ID>"
//                         }
//                     ]
//                 }
//             }
//         }
//     }
// };

const proofJSON={
    "comment": "Proof request for German Immigration Entry Verification",
    "connection_id": "<Enter a valid Connection ID>",
    "presentation_request": {
      "indy": {
        "name": "Germany Entry Verification",
        "version": "1.1",
        "requested_attributes": {
          "full_name": {
            "name": "full_name",
            "restrictions": [
              {
                "cred_def_id": "<Enter a valid Credential Definition ID>"
              }
            ]
          },
          "nationality": {
            "name": "nationality",
            "restrictions": [
              {
                "cred_def_id": "<Enter a valid Credential Definition ID>",
                "attr::nationality::value": "India"
              }
            ]
          },
          "visa_issuing_country": {
            "name": "visa_issuing_country",
            "restrictions": [
              {
                "cred_def_id": "<Enter a valid Credential Definition ID>",
                "attr::visa_issuing_country::value": "Germany"
              }
            ]
          },
          "visa_category": {
            "name": "visa_category",
            "restrictions": [
              {
                "cred_def_id": "<Enter a valid Credential Definition ID>",
                "attr::visa_category::value": "Tourist"
              }
            ]
          }
        },
        "requested_predicates": {
          "passport_valid_for_6_months": {
            "name": "passport_expiry_date",
            "p_type": ">",
            "p_value": 20241003,
            "restrictions": [
              {
                "cred_def_id": "<Enter a valid Credential Definition ID>"
              }
            ]
          },
          "stay_within_6_months": {
            "name": "travel_return_date",
            "p_type": "<=",
            "p_value": 20241001,
            "restrictions": [
              {
                "cred_def_id": "<Enter a valid Credential Definition ID>"
              }
            ]
          },
          "visa_validity_check": {
            "name": "visa_valid_until",
            "p_type": ">=",
            "p_value": 20241001,
            "restrictions": [
              {
                "cred_def_id": "<Enter a valid Credential Definition ID>"
              }
            ]
          }
        }
      }
    }
  };

router.use(function (req, res, next) {
    navLinkService.clearLinkClasses();
    navLinkService.setNavLinkActive('/proofs');
    next();
});

router.get('/', async function(req, res, next) {
    const agentService = require('../services/AgentService');

    const proofs = await agentService.getProofRequests();

    navLinkService.setCustomNavLinkActive('/proofs');
    res.render('proof', {
        navLinks: navLinkService.getNavLinks(),
        customNavLinks: navLinkService.getCustomNavLinks(),
        proofs: proofs
    });
});

router.get('/request', handleRequestProofGet);

router.post('/request', [
    check('connection_id')
        .notEmpty()
        .withMessage('Connection ID is required'),
    check('credential_definition_id')
        .notEmpty()
        .withMessage('Credential Definition ID is required'),
], handleRequestProofPost, handleRequestProofGet);

async function handleRequestProofGet(req, res, next) {
    const agentService = require('../services/AgentService');
    const allConnections = await agentService.getConnections();
    const connections = allConnections.filter(connection => connection.state === 'active' || connection.state === 'request');
    
    if (req.errors) {
        res.status(422);
    }

    navLinkService.setCustomNavLinkActive('/proofs/request');

    res.render('request_proof', {
        navLinks: navLinkService.getNavLinks(),
        customNavLinks: navLinkService.getCustomNavLinks(),
        connections,
        errors: req.errors || null,
        error_keys: (req.errors || []).map(error => error.param),
        proof: {
            proof: (req.errors && req.proof.proof_object) || JSON.stringify(proofJSON, null, 4),
            connectionId: req.errors && req.proof.connection_id,
            credentialDefinitionId: req.errors && req.proof.credential_definition_id,
        }
    });
}

async function handleRequestProofPost(req, res, next) {
    const agentService = require('../services/AgentService');

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.errors = errors.array();
        req.proof = req.body;
        return next();
    }

    await agentService.sendProofRequest(req.body.proof_object);
    res.status(201).redirect('/proofs');
}

module.exports = router;