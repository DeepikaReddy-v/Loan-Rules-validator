# Loan-Rules-validator
We can pass required details and can validate rules and check EMI details


step 1  --> Clone Repo
step 2  --> npm install
step 3  --> npm start
step 4  --> Open Postman
            URL --> (POST method) localhost:3000/loan/validate 
            Body--> 
                {
                    "borrowerName" : "Mohan",
                    "dateofbirth" : "2000-05-12",
                    "city" : "Hubli",
                    "creditScore" : 6,
                    "loanAmount" : 100000,
                    "email" : "swaroop@gmail.com"
                }

email for queries --> swaroopreddy223@gmail.com