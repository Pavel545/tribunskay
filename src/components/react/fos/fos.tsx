import React, { useState, type FormEvent, type ChangeEvent, useRef, useEffect } from 'react';
import './fos.css';

interface FormData {
    name: string;
    tel: string;
    message: string;
    consent: boolean;
}

const QuestionForm: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const [formData, setFormData] = useState<FormData>({
        name: '',
        tel: '',
        message: '',
        consent: false
    });

    const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Очистка таймера при размонтировании
    useEffect(() => {
        return () => {
            if (successTimeoutRef.current) {
                clearTimeout(successTimeoutRef.current);
            }
        };
    }, []);

    // Маска для телефона
    const handlePhoneInput = (e: ChangeEvent<HTMLInputElement>): void => {
        let value = e.target.value.replace(/\D/g, '');

        // Ограничиваем длину номера
        if (value.length > 11) {
            value = value.slice(0, 11);
        }

        const match = value.match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);

        if (match) {
            let formatted = '';
            if (match[2]) {
                formatted = `+7 (${match[2]})`;
                if (match[3]) {
                    formatted += ` ${match[3]}`;
                    if (match[4]) {
                        formatted += `-${match[4]}`;
                        if (match[5]) {
                            formatted += `-${match[5]}`;
                        }
                    }
                }
            } else if (match[1]) {
                formatted = `+7 (${match[1]}`;
            } else {
                formatted = '+7 (';
            }

            setFormData(prev => ({ ...prev, tel: formatted }));
        }
    };

    // Обработка изменений в полях
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value, type, checked } = e.target;

        if (name === 'tel') {
            handlePhoneInput(e);
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }

        // Убираем ошибку при вводе
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: false }));
        }
    };

    // Валидация формы
    const validateForm = (): boolean => {
        const newErrors: Record<string, boolean> = {};

        if (!formData.name.trim()) {
            newErrors.name = true;
        }

        const phoneDigits = formData.tel.replace(/\D/g, '');
        if (phoneDigits.length < 11) {
            newErrors.tel = true;
        }

        if (!formData.message.trim()) {
            newErrors.message = true;
        }

        if (!formData.consent) {
            newErrors.consent = true;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Показать сообщение об успехе
    const showSuccessMessage = () => {
        // Очищаем предыдущий таймер если есть
        if (successTimeoutRef.current) {
            clearTimeout(successTimeoutRef.current);
        }

        setShowSuccess(true);

        // Устанавливаем новый таймер
        successTimeoutRef.current = setTimeout(() => {
            setShowSuccess(false);
        }, 3000);
    };

    // Отправка формы
    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Имитация отправки с задержкой
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Показываем сообщение об успехе
            showSuccessMessage();

            // Очищаем форму
            setFormData({
                name: '',
                tel: '+7 (',
                message: '',
                consent: false
            });

        } catch (error) {
            console.error('Ошибка отправки:', error);
            alert('Произошла ошибка. Попробуйте позже.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fosBox">
            <h3 className="title">Возникли вопросы?</h3>
            <span className="ps">
                Заполните форму, и мы свяжемся с вами для ответа на Ваш вопрос
            </span>

            <form className="fosForm" onSubmit={handleSubmit} noValidate>
                <input
                    className={`inputFos ${errors.name ? 'error' : ''}`}
                    name="name"
                    placeholder="Ваше имя"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                />

                <input
                    className={`inputFos ${errors.tel ? 'error' : ''}`}
                    name="tel"
                    placeholder="+7 (___) ___-__-__"
                    type="tel"
                    value={formData.tel}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                />

                <input
                    className={`inputFos ${errors.message ? 'error' : ''}`}
                    name="message"
                    placeholder="Ваш вопрос"
                    type="text"
                    value={formData.message}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                />

                <label className={`checkbox-container ${errors.consent ? 'error' : ''}`}>
                    <input
                        type="checkbox"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                    />
                    <span className="checkmark"></span>
                    <span className="checkbox-text">
                        Согласие на обработку персональных данных
                    </span>
                </label>

                <button
                    className="butt fosBut"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <span className="button-loader">Отправка...</span>
                    ) : 'Отправить'}
                </button>
            </form>

            {/* Сообщение об успехе */}
            <div className={`success-message ${showSuccess ? 'show' : ''}`}>
                <div className="success-content">
                    <span className="success-icon">✓</span>
                    <span>Спасибо! Ваше сообщение отправлено</span>
                </div>
            </div>
        </div>
    );
};

export default QuestionForm;