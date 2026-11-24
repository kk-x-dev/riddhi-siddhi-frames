import Image from "next/image";

export default function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 border-t border-border">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="md:flex md:items-start md:gap-12 lg:gap-16">
          {/* Image */}
          <div className="md:w-5/12 mb-8 md:mb-0">
            <div className="relative aspect-[4/5] bg-[#EDE8DC] border border-border overflow-hidden">
              <Image
                src="/images/about-home.jpg"
                alt="सुंदर भारतीय घरातील देवघर"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif-deva text-sm text-secondary text-center px-8 leading-relaxed">
                  आपल्या घरातील एक खास जागा
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="md:w-7/12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
              आमची छोटीशी गोष्ट...
            </h2>

            <div className="space-y-4 font-sans-deva text-sm md:text-base text-secondary leading-relaxed">
              <p>
                प्रत्येक घरात काही गोष्टी खास असतात. कोणासाठी देवघरातील गणपती
                बाप्पा, कोणासाठी महादेव, तर कोणासाठी छत्रपती शिवाजी
                महाराजांची प्रतिमा म्हणजे अभिमान आणि प्रेरणेचं प्रतीक.
              </p>
              <p>
                आमच्यासाठी फ्रेम म्हणजे केवळ भिंतीवर लावायची एक वस्तू नाही. ती
                आपल्या श्रद्धेची, आवडीची आणि मनाशी जोडलेल्या भावनांची एक
                सुंदर आठवण आहे.
              </p>
              <p>
                याच भावनेतून रिद्धी सिद्धी फ्रेम्सच्या माध्यमातून तुमच्या
                आवडीच्या देवदेवता आणि प्रेरणादायी व्यक्तिमत्त्वांच्या सुंदर
                फ्रेम्स तुमच्यापर्यंत पोहोचवण्याचा आमचा प्रयत्न आहे.
              </p>
              <p>
                तुम्ही स्वतःसाठी फ्रेम निवडत असाल किंवा आपल्या प्रिय
                व्यक्तीला भेट देण्यासाठी शोधत असाल, तुमच्या आवडीची फ्रेम
                शोधण्यात आम्हाला आनंदच होईल.
              </p>
              <p className="font-semibold text-foreground pt-2">
                तुमची श्रद्धा, तुमची आवड... आणि आमची मनापासून केलेली निवड!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
