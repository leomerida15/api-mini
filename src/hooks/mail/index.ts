import nodemailer, { SendMailOptions } from 'nodemailer';

export const mailer = nodemailer.createTransport({
    host: "localhost",
    port: 25,
    secure: false,
    auth: {
        user: "dev@grandiose-pear.com",
        pass: "VitM24001470"
    }
});

const mailMsg = (name: string, clave: string): string => {
    /*html*/
    return `
    <html>
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@100&display=swap" rel="stylesheet">

    <body style="background-color: #f2f3f5;padding: 30px">
        <div
            style="max-width: 600px; margin: 0 auto; background-color: #fff; font: 14px sans-serif; border-top: 4px solid #004063">
            <!--  -->
            <div style="border-bottom: 1px solid #f2f3f5; padding: 2px 10px;background-color: #fff">
                <div style="background-color: #fff;text-align: center;">
                    <img style="width: 70%"
                        src="https://lh5.googleusercontent.com/N8EpOnPDJyCOPTY5apagF6nY3uf2gNHDMq7-WsIUnZjkJJSt1_wiQMBPH41uwKRwe-qS2Ijqmgl5tEANLkJD=w1920-h907-rw" />
                </div>
            </div>
            <div style="background-color: #fff; padding: 0px 30px">
                <div style="border-bottom: 1px solid #f2f3f5">
                    <h2>Hola ${name}</h2>
                    <p style="font-size: 14px; outline: 0; text-align: justify;font-family: 'Roboto', sans-serif">
                        Hola aqui tiene su neva contraseña.
                        <br />
                        <br />
                        clave: ${clave}
                        <br />
                        <br />
                        <br />
                    </p>


                </div>
                <p style="font-size: 14px; outline: 0; text-align: justify;font-family: 'Roboto', sans-serif">
                    Gracias por confiar en nosotros.
                </p>

                <br />
            </div>
        </div>
        <div style="max-width: 600px; margin: 0 auto;font: 14px sans-serif">

        </div>
    </body>

    </html>`;
};

export default mailMsg;