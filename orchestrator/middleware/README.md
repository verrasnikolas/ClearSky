Πριν από κάθε επεξεργασία από orchestrator controllers γίνεται ένα πέρασμα από το middleware

Τα request φτάνουν πρώτα σε ένα middleware που είναι υπεύθυνο για την αυθεντικοποίηση.

Ροή: αίτημα frontend -> orch route -> orch middleware -> orch controller -> orch service -> microservice