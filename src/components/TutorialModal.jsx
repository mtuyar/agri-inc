import React, { useState } from 'react';

const TutorialModal = ({ onClose }) => {
  const [step, setStep] = useState(0);

  const tutorialSteps = [
    {
      title: "🌾 AgriInc'e Hoş Geldiniz!",
      description: "Türkiye'nin en gelişmiş tarım yönetimi simülasyonunda stratejik kararlar alarak başarılı bir çiftçi olun.",
      icon: "🎯",
      tips: [
        "NASA'nın gerçek veri sistemlerini kullanıyorsunuz",
        "5 sezon boyunca tarlanızı yöneteceksiniz",
        "Doğru kararlar başarının anahtarı!"
      ]
    },
    {
      title: "📊 NASA Verileri",
      description: "Oyunda kullanılan veriler NASA'nın gerçek tarım izleme sistemlerine dayanır.",
      icon: "🛰️",
      tips: [
        "NDVI (Normalized Difference Vegetation Index): Bitki sağlığı indeksi",
        "IMERG (Integrated Multi-satellitE Retrievals): Yağış verisi",
        "Bu verilerle bilinçli kararlar alın"
      ]
    },
    {
      title: "💧 Sulama Kararları",
      description: "Her sezon sulama kararı vermeniz gerekir. Su bitkiler için hayati önem taşır!",
      icon: "💧",
      tips: [
        "Sulamak: +10 sağlık, 10₺ maliyet",
        "Sulamamak: -5 sağlık, ücretsiz",
        "Bütçenizi akıllıca kullanın"
      ]
    },
    {
      title: "🌱 Gübreleme",
      description: "Gübre bitkilerin büyümesi için gerekli besinleri sağlar.",
      icon: "🌱",
      tips: [
        "Gübrelemek: +15 sağlık, 15₺ maliyet",
        "Gübrelememek: -3 sağlık, ücretsiz",
        "Düzenli gübreleme önemlidir"
      ]
    },
    {
      title: "🌦️ Hava Olayları",
      description: "Her karar sonrası rastgele bir hava olayı gerçekleşir. Hazırlıklı olun!",
      icon: "🌈",
      tips: [
        "🌧️ Yağışlı Sezon: +15 sağlık",
        "☀️ Kuraklık: -20 sağlık",
        "⛅ Normal İklim: +5 sağlık"
      ]
    },
    {
      title: "🚀 Teknoloji Ağacı",
      description: "Kazandığınız para ile yeni teknolojiler satın alarak verimliliği artırın!",
      icon: "💎",
      tips: [
        "Damla Sulama: Su kullanımını %20 artırır",
        "Organik Gübre: Gübreleme etkisini %30 artırır",
        "Uydu İzleme: Olumsuz hava etkilerini %50 azaltır"
      ]
    },
    {
      title: "🎯 Hedef",
      description: "5 sezon sonunda yüksek puan alarak başarılı bir çiftçi olun!",
      icon: "🏆",
      tips: [
        "Bitki sağlığınızı 70+ tutmaya çalışın",
        "Bütçenizi akıllıca yönetin",
        "Teknolojilere yatırım yapın",
        "800+ puan = Mükemmel çiftçi! 🌟"
      ]
    }
  ];

  const currentStep = tutorialSteps[step];
  const isLastStep = step === tutorialSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full transform scale-100 animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="text-5xl">{currentStep.icon}</div>
            <button
              onClick={handleSkip}
              className="text-white/80 hover:text-white text-sm font-semibold"
            >
              Atla ✕
            </button>
          </div>
          <h2 className="text-2xl font-bold mb-2">{currentStep.title}</h2>
          <p className="text-green-100">{currentStep.description}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-3 mb-6">
            {currentStep.tips.map((tip, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-green-50 rounded-lg transform transition-all hover:scale-102"
                style={{
                  animation: `slideIn 0.3s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="text-green-600 font-bold text-lg mt-0.5">
                  {index + 1}.
                </div>
                <div className="text-gray-700 flex-1">{tip}</div>
              </div>
            ))}
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-6">
            {tutorialSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setStep(index)}
                className={`h-2 rounded-full transition-all ${
                  index === step
                    ? 'w-8 bg-green-600'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              disabled={step === 0}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                step === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ← Geri
            </button>

            <div className="text-sm text-gray-500 font-semibold">
              {step + 1} / {tutorialSteps.length}
            </div>

            <button
              onClick={handleNext}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg"
            >
              {isLastStep ? 'Başla! 🚀' : 'İleri →'}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TutorialModal;

