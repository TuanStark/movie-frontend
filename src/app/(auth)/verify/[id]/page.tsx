"use client";

import { useState } from "react";
import BackgroundGradient from "@/components/BackgroundGradient";
import { useRouter } from "next/navigation";


interface PageProps {
    params: {
        id: string;
    };
}

interface FormData {
    codeId: string;
}
interface FormErrors {
    codeId?: string;
    general?: string;
}
export default function VerifyTokenPage({ params }: PageProps) {
    const router = useRouter();
    const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [formData, setFormData] = useState<FormData>({
        codeId: '',
    });

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.codeId) {
            newErrors.codeId = "Mã xác thực là bắt buộc";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        // Clear error when typing
        if (errors[e.target.name as keyof FormErrors]) {
            setErrors({
                ...errors,
                [e.target.name]: undefined,
            });
        }
    };

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        const { codeId } = formData;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check-code`, {
                method: "POST",
                body: JSON.stringify({
                    id: params.id,
                    codeId: codeId,
                }),
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (data?.data) {
                setVerificationStatus('success');
                setMessage('Xác thực thành công! Đang chuyển hướng...');
            } else {
                setVerificationStatus('error');
                setMessage('Mã xác thực không chính xác');
            }
        } catch (error) {
            setVerificationStatus('error');
            setMessage('Đã xảy ra lỗi khi xác thực email. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = () => {
        switch (verificationStatus) {
            case 'loading':
                return 'text-blue-600 dark:text-blue-400';
            case 'success':
                return 'text-green-600 dark:text-green-400';
            case 'error':
            case 'expired':
                return 'text-red-600 dark:text-red-400';
            default:
                return 'text-gray-600 dark:text-gray-400';
        }
    };
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <BackgroundGradient />

            <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-md w-full">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 relative z-10 text-center">
                        {/* Status Icon */}
                        {/* <div className="mx-auto w-24 h-24 flex items-center justify-center mb-6">
                            {getStatusIcon()}
                        </div> */}

                        {/* Status Title */}
                        <h1 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
                            XÁC THỰC TÀI KHOẢN
                        </h1>

                        {/* Status Message */}
                        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                            Vui lòng nhập mã xác thực để hoàn thành đăng ký. Vui lòng kiểm ta email của bạn
                        </p>

                        {/* Status Message */}
                        {message && (
                            <div className={`mb-6 p-3 rounded ${verificationStatus === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'}`}>
                                <p>{message}</p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="userId" className="text-left">ID Người dùng</label>
                                        <input
                                            id="userId"
                                            type="text"
                                            placeholder="ID người dùng"
                                            value={params.id}
                                            disabled={true}
                                            className="rounded-lg p-4 border border-gray-300 dark:border-gray-600 bg-gray-100
                                        dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="codeId" className="text-left"> Mã xác thực</label>
                                        <input
                                            id="codeId"
                                            name="codeId"
                                            type="text"
                                            placeholder="Nhập mã xác thực"
                                            value={formData.codeId}
                                            onChange={handleChange}
                                            className={`rounded-lg p-4 border ${errors.codeId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white
                                        dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2
                                        focus:ring-primary-500 transition-colors`} />
                                        {errors.codeId && <p className="text-sm text-red-500 text-left">{errors.codeId}</p>}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex items-center justify-center px-6 py-3 rounded-xl font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 transition-colors shadow-lg hover:shadow-xl"
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Đang xác thực...
                                            </>
                                        ) : (
                                            'Xác thực'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}