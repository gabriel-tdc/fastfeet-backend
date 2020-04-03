import Mail from '../../lib/Mail';

class NotificationEmail {
  get key() {
    return 'NotificationEmail';
  }

  async handle({ data }) {
    const { email, name, product } = data;

    // Enviar email
    Mail.sendMail({
      to: email,
      subject: 'Uma nova entrega',
      template: 'notification',
      context: {
        name,
        content: `Uma nova entrega (${product}) foi designada para você`,
      },
    });
  }
}

export default new NotificationEmail();
