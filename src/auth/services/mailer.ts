// import hbs from 'nodemailer-express-handlebars';
//@ts-ignore
import hbs, { NodemailerExpressHandlebarsOptions } from 'nodemailer-express-handlebars';
import * as nodemailer from 'nodemailer';
import fs from 'fs';
import * as path from 'path';
import * as emailConfigs from '../configs/emailConfigs.json';

export const sendMail = async (email: string, name: string, token: string) => {

  console.log(`Token for -- ${email} ${name}: `, token);

  // const getBase64Image = (imagePath: string): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     fs.readFile(imagePath, { encoding: 'base64' }, (err, data) => {
  //       if (err) reject(err);
  //       resolve(`data:image/jpeg;base64,${data}`);
  //     });
  //   });
  // };


  // initialize nodemailer
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'regentxy@gmail.com',
      pass: 'cqyn ueft psyx jmbx',
    },
  });

  // point to the template folder
  const handlebarOptions: NodemailerExpressHandlebarsOptions = {
    viewEngine: {
      extname: '.handlebars',
      partialsDir: './src/auth/emailTemplates/',
      layoutsDir: './src/auth/emailTemplates/',
      defaultLayout: 'emailVerification',
    },
    viewPath: './src/auth/emailTemplates/',
    extName: '.handlebars',
  };

  console.log('Setting up handlebars');
  // use a template file with nodemailer
  transporter.use('compile', hbs(handlebarOptions));

  interface MailOptions {
    from: string;
    to: string;
    subject: string;
    template: string;
    context: {
      name: string;
      mail: string;
      verificationLink: string;
      //   applogoUrl: string;
    };
  }

  const mailOptions: MailOptions = {
    from: '"AirLifeGoa" balijapellypranav2507@gmail.com', // sender address
    to: email, // list of receivers
    subject: 'Welcome!',
    template: 'email', // the name of the template file i.e email.handlebars
    context: {
      name: name,
      mail: email,
      verificationLink: emailConfigs.verifyEndPointUrl + token,
      //   applogoUrl: emailConfigs.appLogoUrl + encodedImage,
    },
  };

  // trigger the sending of the E-mail
  console.log('Sending mail...')
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred:' + error);
      return error;
    }
    console.log('Message sent: ' + info.response);
  });
};
