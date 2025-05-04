Τα services περιέχουν τη λογική για την επικοινωνία με τα microservices.

Όταν ένας orchestrator controller καλεί μια συνάρτηση σε ένα service, το service κάνει ένα HTTP request στο αντίστοιχο microservice.

Το service λαμβάνει το response από το microservice, το επεξεργάζεται (αν χρειάζεται), και το επιστρέφει στον controller.

