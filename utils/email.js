// utils/email.js
const nodemailer = require('nodemailer');

// Criar transporter de email
const createTransporter = () => {
  // Configuração do SMTP
  const smtpConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true para 465, false para outras portas
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS, // Para Gmail, use "App Password" não a senha normal
    },
  };

  // Se não tiver configuração SMTP, retornar null (modo desenvolvimento)
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️  SMTP não configurado. Emails não serão enviados.');
    return null;
  }

  return nodemailer.createTransport(smtpConfig);
};

// Função para enviar email
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.log('📧 Email não enviado (SMTP não configurado):');
      console.log(`   Para: ${to}`);
      console.log(`   Assunto: ${subject}`);
      return { success: false, message: 'SMTP não configurado' };
    }

    const mailOptions = {
      from: `"Portal do Aluno" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Remover HTML se não tiver texto
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email enviado com sucesso:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return { success: false, error: error.message };
  }
};

// Template de email para reset de senha
const sendPasswordResetEmail = async (email, resetUrl, userName = 'Usuário') => {
  const subject = 'Redefinição de Senha - Portal do Aluno';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: #667eea;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .button:hover {
          background: #5568d3;
        }
        .footer {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #666;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Portal do Aluno</h1>
      </div>
      <div class="content">
        <h2>Olá, ${userName}!</h2>
        <p>Você solicitou a redefinição de senha da sua conta no Portal do Aluno.</p>
        <p>Clique no botão abaixo para redefinir sua senha:</p>
        <div style="text-align: center;">
          <a href="${resetUrl}" class="button">Redefinir Senha</a>
        </div>
        <p>Ou copie e cole o link abaixo no seu navegador:</p>
        <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
        <p><strong>Este link expira em 1 hora.</strong></p>
        <p>Se você não solicitou esta redefinição, ignore este email. Sua senha permanecerá a mesma.</p>
      </div>
      <div class="footer">
        <p>Este é um email automático, por favor não responda.</p>
        <p>&copy; ${new Date().getFullYear()} Portal do Aluno - Todos os direitos reservados</p>
      </div>
    </body>
    </html>
  `;

  const text = `
    Olá, ${userName}!
    
    Você solicitou a redefinição de senha da sua conta no Portal do Aluno.
    
    Clique no link abaixo para redefinir sua senha:
    ${resetUrl}
    
    Este link expira em 1 hora.
    
    Se você não solicitou esta redefinição, ignore este email. Sua senha permanecerá a mesma.
    
    Este é um email automático, por favor não responda.
  `;

  return await sendEmail({ to: email, subject, html, text });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
};

