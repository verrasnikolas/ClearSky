Χειρίζονται τα εισερχόμενα HTTP requests από τους clients

Καλούν τα κατάλληλα services του orchestrator για να εκτελέσουν τις απαραίτητες ενέργειες

Όταν τα services επιστρέψουν τα responses από τα microservices, ο controller τα επεξεργάζεται (αν χρειάζεται), τα συνδυάζει, και στέλνει την τελική απάντηση στον client.