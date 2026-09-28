# NightFlip operator prover

This service runs the Midnight proof server used only by the NightFlip operator
to prove administrative Preprod transactions such as opening, closing, and
revealing a round. It exposes the proof-server HTTP API on port 6300.

Deploy it as a separate Render web service with `services/prover/Dockerfile`.
Set `NIGHTFLIP_PROOF_SERVER_URL` for the operator to its public HTTPS URL.
