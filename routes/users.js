var express = require('express');
var router = express.Router();
const validateRule = require('../rules/approve-reject-rules');
const { body, validationResult } = require('express-validator');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/validate',
  body('email').isEmail().normalizeEmail(),
  // Borrower Name validation
  body('borrowerName').trim()
    .isLength({ min: 3 })
    .withMessage('Borrower Name must be 3 characters long')
    .isAlpha()
    .withMessage('Borrower Name must be alphabetic'),
  // credit score
  body('creditScore', 'Credit Score must be a number between 0 and 900')
    .isFloat({ min: 0, max: 900 }),
  // loan Amount
  body('loanAmount', 'Loan Amount must be a number greater than 50000 and 500000')
    .isFloat({ min: 50000, max: 500000 }),
  function (req, res, next) {
    console.log("req.body::", req.body);
    console.log("==", validateRule.name);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    console.log("body!!!", req.body.dateofbirth);
    // age validations
    let age = getAge(req.body.dateofbirth);
    console.log("mohan age:::", age);
    if (age < 0) {
      res.status(400).json({
        success: false,
        errors: "Date Of Birth cannot be future date"
      });
    } else {
      if (age < validateRule.error.ageBelow) {
        res.status(400).json({
          success: false,
          errors: "Age less than 18 Years"
        });
      } else if (age + validateRule.year > validateRule.error.ageGreater) {
        res.status(400).json({
          success: false,
          errors: "Age along with tenure is more than 60 Years"
        });
      } else {
        let tire = validateCity(req.body.city);
        console.log("tire:::", tire);
        if (tire == 'tire1') {
          if (req.body.creditScore < 300) {
            console.log("credit score is less than 300");
            res.status(400).json({
              success: false,
              errors: "credit score is less than 300.Application Rejected"
            });
          } else if (req.body.creditScore > 300 && req.body.creditScore <= 500) {
            console.log("Approved-300-400");
            let rateofinterest = 14;
            var finalResult = approvedCalculateEMI(req.body.loanAmount, rateofinterest);
            res.status(200).json({
              success: true,
              message: 'Rate of interest 14%. Application Approved',
              data: finalResult
            })
          } else if (req.body.creditScore > 501 && req.body.creditScore <= 700) {
            console.log("Approved-501-700");
            let rateofinterest = 12;
            var finalResult = approvedCalculateEMI(req.body.loanAmount, rateofinterest);
            res.status(200).json({
              success: true,
              message: 'Rate of interest 12%. Application Approved',
              data: finalResult
            })
          }
          else if (req.body.creditScore > 701 && req.body.creditScore <= 800) {
            console.log("Approved-701-800");
            let rateofinterest = 12;
            var finalResult = approvedCalculateEMI(req.body.loanAmount, rateofinterest);
            res.status(200).json({
              success: true,
              message: 'Rate of interest 12%. Application Approved',
              data: finalResult
            })
          }
          else if (req.body.creditScore > 801 && req.body.creditScore <= 900) {
            console.log("Approved-801-900");
            let rateofinterest = 10;
            var finalResult = approvedCalculateEMI(req.body.loanAmount, rateofinterest);
            res.status(200).json({
              success: true,
              message: 'Rate of interest 10%. Application Approved',
              data: finalResult
            })
          }
        } else if (tire == 'tire2') {
          if (req.body.creditScore <= 300) {
            console.log("credit score is less than 300");
            res.status(400).json({
              success: false,
              errors: "credit score is less than 300.Application Rejected"
            });
          } else if (req.body.creditScore > 301 && req.body.creditScore <= 500) {
            console.log("credit score is less than 500");
            res.status(400).json({
              success: false,
              errors: "credit score is less than 500..Application Rejected"
            });
          } else if (req.body.creditScore > 501 && req.body.creditScore <= 700) {
            console.log("Approved");
            let rateofinterest = 13;
            var finalResult = approvedCalculateEMI(req.body.loanAmount, rateofinterest);
            res.status(200).json({
              success: true,
              message: 'Rate of interest 13%. Application Approved',
              data: finalResult
            })
          }
          else if (req.body.creditScore > 701 && req.body.creditScore <= 800) {
            let rateofinterest = 13;
            var finalResult = approvedCalculateEMI(req.body.loanAmount, rateofinterest);
            res.status(200).json({
              success: true,
              message: 'Rate of interest 13%. Application Approved',
              data: finalResult
            })
          }
          else if (req.body.creditScore > 801 && req.body.creditScore <= 900) {
            let rateofinterest = 11;
            var finalResult = approvedCalculateEMI(req.body.loanAmount, rateofinterest);
            res.status(200).json({
              success: true,
              message: 'Rate of interest 11%. Application Approved',
              data: finalResult
            })
          }
        } else {
          res.status(400).json({
            success: false,
            errors: "City Not Available"
          });
        }
      }
    }
  });

function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function validateCity(city) {
  let res1 = validateRule.tire1.includes(city);
  let res2 = validateRule.tire2.includes(city);
  if (res1 & res2) {
    return false
  }
  if (res1) {
    return "tire1"
  }
  if (res2) {
    return "tire2"
  }
}

function approvedCalculateEMI(loanAmount, interest) {
  let EMI = (loanAmount / validateRule.tenure).toFixed(2);
  console.log("EMI!!!", EMI);
  let LInterestEMI = (((loanAmount * 1 * interest) / 100) / 12).toFixed(2);
  console.log("LInterestEMI!!!", LInterestEMI);
  let total = parseInt(EMI) + parseInt(LInterestEMI);
  console.log("total!!!", total);
  let approvedResult = [];
  var now = new Date();
  now.setDate(01);
  for (let a = 0; a < validateRule.tenure; a++) {
    var next_month = new Date(now.setMonth(now.getMonth() + 1));
    approvedResult.push({ 
     'Sno': a+1,
     'Principal': EMI,
     'Interset': LInterestEMI, 
     'TotalLoanPayable': total, 
     'EmiDate' : next_month
    })
  }
  console.log("Final Result!!!", approvedResult);
  return approvedResult
}

module.exports = router;
