import Mail from '../../lib/Mail';

class CancelationEmail {
  get key() {
    return 'CancelationEmail';
  }

  async handle({ data }) {
    const { email, name, product } = data;

    // Enviar email
    Mail.sendMail({
      to: email,
      subject: 'Cancelamento de Entrega',
      template: 'notification',
      context: {
        name,
        content: `A entrega do produto ${product} foi cancelada`,
      },
    });
  }
}

export default new CancelationEmail();
