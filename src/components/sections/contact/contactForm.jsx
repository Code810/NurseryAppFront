import React, { useState } from 'react';
import { FaEnvelope, FaLocationDot, FaPaperPlane, FaPhone } from 'react-icons/fa6';
import Swal from 'sweetalert2'; 
import Title from '@/components/ui/title';
import { Button } from '@/components/ui/button';
import contact_1 from "@/assets/images/contact/contact-1.png";
import SectionName from '@/components/ui/sectionName';
import Input from '@/components/ui/input';
import { api } from '@/utils/axios';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        address: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({}); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setFieldErrors({}); 

        try {
            const response = await api().post('/Contact', {
                fullName: formData.fullName,
                email: formData.email,
                adress: formData.address,  
                message: formData.message
            });

            
            Swal.fire({
                icon: 'success',
                title: 'Mesajınız göndərildi',
                text: 'Bizə mesaj göndərdiyiniz üçün təşəkkür edirik!',
                confirmButtonText: 'OK'
            }).then(() => {
                
                setFormData({
                    fullName: '',
                    email: '',
                    address: '',
                    message: ''
                });
            });
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                
                const serverErrors = error.response.data.errors;
                const formattedErrors = {};

                serverErrors.forEach((err) => {
                    const key = Object.keys(err)[0]; 
                    formattedErrors[key] = err[key]; 
                });

                setFieldErrors(formattedErrors); 
            } else {
                setError('Failed to submit the form. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="lg:pt-15 lg;pb-15 pb-10 pt-10">
            <div className="container">
                <div className="max-w-[546px] mx-auto text-center">
                    <SectionName>Contact</SectionName>
                    <Title size={"3.5xl"}>Bizimlə əlaqə üçün formu doldurun</Title>
                </div>
                <div className="mt-15">
                    <div className="grid lg:grid-cols-2 grid-cols-1 items-center gap-7.5">
                        <div className="relative">
                            <div className="flex lg:justify-end justify-center">
                                <img src={contact_1} alt="Contact Image" />
                            </div>
                        </div>
                        <div>
                            <div className="bg-background shadow-[0px_5px_60px_0px_rgba(0,0,0,0.05)] rounded-[10px] lg:p-10 p-5">
                                <h3 className="text-[28px] font-bold leading-[148%] font-nunito">Əlaqə formu</h3>
                                <form onSubmit={handleSubmit} className="mt-7">
                                    <div className="grid sm:grid-cols-2 grid-cols-1 gap-7.5">
                                        <div className="relative">
                                            <Input 
                                                type="text" 
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                placeholder="Ad Soyad" 
                                                id="name"
                                                className="text-[#686868] border-[#F2F2F2] lg:py-[15px] px-5"
                                                required
                                            />
                                            <label htmlFor="name" className="absolute right-5 top-1/2 -translate-y-1/2">
                                                <FaPaperPlane />
                                            </label>
                                            {fieldErrors.FullName && (
                                                <p className="text-red-500 mt-1">{fieldErrors.FullName}</p>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <Input 
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Email"
                                                id="email"
                                                className="text-[#686868] border-[#F2F2F2] lg:py-[15px] px-5"
                                                required
                                            />
                                            <label htmlFor="email" className="absolute right-5 top-1/2 -translate-y-1/2">
                                                <FaPhone />
                                            </label>
                                            {fieldErrors.Email && (
                                                <p className="text-red-500 mt-1">{fieldErrors.Email}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="relative mt-5">
                                        <Input 
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="Address"
                                            id="address"
                                            className="text-[#686868] border-[#F2F2F2] lg:py-[15px] px-5"
                                            required
                                        />
                                        <label htmlFor="address" className="absolute right-5 top-1/2 -translate-y-1/2">
                                            <FaLocationDot />
                                        </label>
                                        {fieldErrors.Adress && (
                                            <p className="text-red-500 mt-1">{fieldErrors.Adress}</p>
                                        )}
                                    </div>

                                    <div className="relative mt-5">
                                        <textarea 
                                            name="message"
                                            id="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Mesajınızı bura yazın"
                                            className="w-full min-h-36 rounded-[10px] border-2 text-[#686868] border-[#F2F2F2] px-5 py-[15px] outline-none"
                                            required
                                        ></textarea>
                                        <label htmlFor="message" className="absolute right-5 top-[15px]">
                                            <FaEnvelope />
                                        </label>
                                        {fieldErrors.Message && (
                                            <p className="text-red-500 mt-1">{fieldErrors.Message}</p>
                                        )}
                                    </div>

                                    {error && <p className="text-red-500 mt-3">{error}</p>}

                                    <Button 
                                        type="submit"
                                        variant="pill"
                                        className="w-full bg-primary border-primary hover:text-primary-foreground lg:mt-10 mt-5"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Sending...' : 'Send Now'}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;
