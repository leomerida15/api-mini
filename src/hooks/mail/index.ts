import nodemailer, { SendMailOptions } from 'nodemailer';

export const mailer = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    secure: true,
    auth: {
        user: "apikey",
        pass: "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"
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
                        src="https://sabaneta.miproyectoparticipativo.com/img/Lodo_Sabaneta_60x60.png" />
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