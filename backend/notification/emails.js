const maildata = require("../config/mail-data");
const transpoter = require("../config/mail-setup");
const moment = require("moment");

exports.notifyBookingSlotChange = async (
  userName,
  userEmail,
  newAppointmentDate
) => {
  let option = {
    from: maildata.bookingChangeTime.from,
    to: userEmail,
    subject: maildata.bookingChangeTime.subject,
    html: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                  <title>Booking Slot Changed</title>
                  <link
                    href="https://fonts.googleapis.com/css2?family=Biryani:wght@400&display=swap"
                    rel="stylesheet"
                  />
                  <style>
                    body {
                      font-family: "Biryani", sans-serif;
                    }
              
                    .button {
                      width: 140px;
                      height: 45px;
                      font-family: "Roboto", sans-serif;
                      font-size: 11px;
                      text-transform: uppercase;
                      letter-spacing: 2.5px;
                      font-weight: 500;
                      color: #000;
                      background-color: #fff;
                      border: none;
                      border-radius: 45px;
                      box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
                      transition: all 0.3s ease 0s;
                      cursor: pointer;
                      outline: none;
                      margin-left: 4%;
                    }
              
                    .button:hover {
                      background-color: #2ee59d;
                      box-shadow: 0px 15px 20px rgba(46, 229, 157, 0.4);
                      color: #fff;
                      transform: translateY(-7px);
                    }
                  </style>
                </head>
              
                <body>
                  <img
                    style="display: block; margin: auto; width: 90%"
                    src="https://storage.googleapis.com/extra-insights-images/1600855680478BlogBanner_SubscriptionAd.jpg"
                    alt="extra insights"
                  />
                  <div style="margin-left: 5%; margin-right: 5%">
                    <p>Hi ${userName},</p>
                    <p>
                      I am Admin, COMPANY NAME 
                    </p>
              
                    <p>
                      <strong>
                        Your Appointment Slot is Chnaged. New Booking Date & Time is ${moment(
                          newAppointmentDate
                        ).format("MMMM Do YYYY, h:mm a")}
                      </strong>
                    </p>
                   
                   
                    <p>Thanking You</p>
                    <p>
                     Admin <br />
                      COMPANY NAME
                    </p>
                  </div>
                </body>
                <script
                  src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
                  integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
                  crossorigin="anonymous"
                ></script>
              </html>
              
              `,
  };

  transpoter.sendMail(option, (er, information) => {
    if (er) {
      console.log(er);
    } else {
      console.log("success");
    }
  });
};
