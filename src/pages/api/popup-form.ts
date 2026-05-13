import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.yandex.ru',
  port: 465,
  secure: true,
  auth: {
    user: import.meta.env.SMTP_USER,
    pass: import.meta.env.SMTP_PASS,
  },
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const phone = formData.get('phone')?.toString() || '';
    const service = formData.get('service')?.toString() || '';
    const formTitle = formData.get('form_title')?.toString() || 'Форма';
    const privacyPolicy = formData.get('privacy_policy')?.toString() || '';

    // Валидация
    if (!phone) {
      return new Response(
        JSON.stringify({ error: 'Телефон обязателен' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!privacyPolicy) {
      return new Response(
        JSON.stringify({ error: 'Нужно согласие на обработку данных' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // HTML письма
    const html = `
      <h2>${formTitle}</h2>
      <p><strong>Имя:</strong> ${name || 'Не указано'}</p>
      <p><strong>Телефон:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email || 'Не указан'}</p>
      <p><strong>Комментарий:</strong> ${service || 'Нет'}</p>
      <p><strong>Время:</strong> ${new Date().toLocaleString('ru-RU')}</p>
    `;

    // Отправка
    await transporter.sendMail({
      from: '"Сайт" <ForAnalyticss@yandex.ru>',
      to: ['acr-agency@yandex.ru', 'ForAnalyticss@yandex.ru'],
      subject: `${formTitle} от ${name || 'Клиент'}`,
      html,
      replyTo: email || undefined,
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Отправлено!' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Ошибка:', error);
    return new Response(
      JSON.stringify({ error: 'Ошибка сервера' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};