import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_blog = '''        <!-- Blog View (Initially Hidden) -->
        <div id="blog-view" class="hidden-view" style="display: none; background: #fbfaf8; padding-bottom: 120px; font-family: \'Montserrat\', sans-serif;">
            
            <style>
                .blog-card-hover:hover .blog-card-img {
                    transform: scale(1.05);
                }
                .blog-card-hover:hover h3 {
                    color: #4b6b8e;
                }
            </style>

            <!-- Himedi style Blog Hero -->
            <div class="blog-hero" style="padding: 120px 0 60px; text-align: center; position: relative;">
                <div class="container">
                    <h1 style="font-family: \'Playfair Display\', serif; font-size: clamp(3rem, 6vw, 4.5rem); font-weight: 700; color: #1a1a1a; margin-bottom: 50px;">Blog</h1>
                    
                    <!-- Featured Post Card -->
                    <div class="featured-post blog-card-hover" style="position: relative; border-radius: 8px; overflow: hidden; height: 500px; text-align: left; box-shadow: 0 10px 30px rgba(0,0,0,0.05); cursor: pointer; transition: transform 0.3s ease;">
                        <img src="assets/blog/hero.png" alt="Featured" class="blog-card-img" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease;">
                        <div style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 40px; background: linear-gradient(to top, rgba(0,0,0,0.85), transparent); color: white;">
                            <span style="font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 15px; display: inline-block;">Featured Story</span>
                            <h2 style="font-family: \'Playfair Display\', serif; font-size: 2.5rem; margin-bottom: 20px; font-weight: 700;">언어 장벽을 넘어선 완벽한 검진 경험</h2>
                            <span style="font-size: 1rem; font-weight: 500; display: inline-flex; align-items: center; gap: 8px; border-bottom: 1px solid white; padding-bottom: 4px;">Read more <i class="fa-solid fa-arrow-right" style="font-size: 0.8rem;"></i></span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container" style="padding-top: 20px;">
                <div class="blog-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 50px;">
                    <!-- Blog Post 1 -->
                    <div class="blog-card blog-card-hover" style="background: transparent;">
                        <div style="position: relative; overflow: hidden; border-radius: 6px; margin-bottom: 24px;">
                            <img src="assets/blog/card2.png" alt="Transparent Pricing" style="width: 100%; height: 260px; object-fit: cover; transition: transform 0.6s ease;" class="blog-card-img">
                        </div>
                        <div class="blog-content">
                            <h3 style="font-family: \'Playfair Display\', serif; font-size: 1.45rem; margin-bottom: 16px; color: #1a1a1a; font-weight: 700; line-height: 1.4; transition: color 0.3s ease;">불투명한 수수료를 없앤 CHECKIT의 투명한 결제 구조</h3>
                            <p style="color: #555; font-size: 0.95rem; line-height: 1.8; margin-bottom: 0;">과거 다른 에이전시를 통해 한국 병원 건강검진을 예약했을 때, 나중에서야 병원 공식 가격 위에 막대한 숨겨진 에이전시 수수료가 추가되어 있었다는 사실을 알게 되었습니다. 실제로 지불한 금액이 병원에서 받은 영수증 금액과 전혀 달랐고, 그 차이를 묻자 "에이전시 관리비"라는 모호한 항목으로만 설명을 받았습니다.<br><br>CHECKIT은 이 구조를 완전히 다르게 설계했습니다. 병원 결제와 CHECKIT 서비스 결제를 처음부터 100% 분리합니다. 고객은 병원에 한국인 동일 공식 정찰제 가격만 직접 지불하고, CHECKIT에는 예약·행정·번역 등의 인프라 서비스 이용료만 별도로 지불합니다. 어떤 경우에도 병원 비용에 수수료가 끼어드는 일은 없으며, CHECKIT은 병원으로부터 어떠한 소개비나 리베이트도 받지 않습니다.<br><br>처음엔 반신반의했지만, 실제 병원 결제 영수증과 CHECKIT 영수증이 완전히 분리된 것을 확인했을 때 비로소 진정한 신뢰가 생겼습니다. 한국 의료 시스템을 이용하는 외국인으로서 이 투명성은 그 어떤 서비스 기능보다 가장 큰 차별점이었습니다.</p>
                        </div>
                    </div>
                    <!-- Blog Post 2 -->
                    <div class="blog-card blog-card-hover" style="background: transparent;">
                        <div style="position: relative; overflow: hidden; border-radius: 6px; margin-bottom: 24px;">
                            <img src="assets/blog/card1.png" alt="Admin Support" style="width: 100%; height: 260px; object-fit: cover; transition: transform 0.6s ease;" class="blog-card-img">
                        </div>
                        <div class="blog-content">
                            <h3 style="font-family: \'Playfair Display\', serif; font-size: 1.45rem; margin-bottom: 16px; color: #1a1a1a; font-weight: 700; line-height: 1.4; transition: color 0.3s ease;">단순 통역이 아닌, 검진 전 과정을 관리하는 비의료 행정 지원</h3>
                            <p style="color: #555; font-size: 0.95rem; line-height: 1.8; margin-bottom: 0;">한국 건강검진을 처음 예약했을 때, 대장내시경 전 준비 약품의 복용법과 전날 식이 제한 지침이 한국어로만 제공되어 완전히 막막했습니다. 번역 앱을 돌려봤지만 "용량에 맞게 물에 희석하여 천천히 복용"처럼 모호한 번역은 실질적인 도움이 전혀 되지 않았습니다.<br><br>CHECKIT의 비의료 행정 전담 지원은 달랐습니다. 예약 확정 직후부터 검진 당일까지, 복용 시간표·식단 제한 항목·병원 도착 시 제출 서류·검사 당일 동선까지 모두 제 모국어로 정리된 문서로 받았습니다. 의료적 판단이나 처방은 물론 하지 않지만, 병원을 이용하는 데 필요한 모든 행정 절차를 빠짐없이 안내해주었습니다.<br><br>검진 당일 병원에 도착했을 때, 저는 이미 무엇을 어떻게 해야 하는지 모두 파악하고 있었습니다. 단순히 말이 통하는 것을 넘어, 완전히 준비된 상태로 검진에 임할 수 있었다는 것이 CHECKIT 서비스의 진짜 가치였습니다.</p>
                        </div>
                    </div>
                    <!-- Blog Post 3 -->
                    <div class="blog-card blog-card-hover" style="background: transparent;">
                        <div style="position: relative; overflow: hidden; border-radius: 6px; margin-bottom: 24px;">
                            <img src="assets/blog/card3.png" alt="Result Translation" style="width: 100%; height: 260px; object-fit: cover; transition: transform 0.6s ease;" class="blog-card-img">
                        </div>
                        <div class="blog-content">
                            <h3 style="font-family: \'Playfair Display\', serif; font-size: 1.45rem; margin-bottom: 16px; color: #1a1a1a; font-weight: 700; line-height: 1.4; transition: color 0.3s ease;">내 건강 상태를 정확히 이해하게 해준 맞춤형 결과지 번역</h3>
                            <p style="color: #555; font-size: 0.95rem; line-height: 1.8; margin-bottom: 0;">건강검진이 끝나고 두꺼운 한국어 결과지를 받았을 때의 당혹감은 말로 표현하기 어렵습니다. "간 기능 수치 ALT 42 U/L", "혈청 크레아티닌 0.9 mg/dL"처럼 숫자는 있지만 그것이 정상인지, 주의가 필요한지 전혀 알 수 없었습니다. 번역 앱으로 돌려봐도 용어 번역에 그칠 뿐, 제 건강에 어떤 의미가 있는지는 알 수 없었습니다.<br><br>CHECKIT은 병원 발행 원본 결과지와 함께, 각 항목의 모국어 번역본 그리고 국제 표준 질병 코드(ICD-10/KCD)를 병기한 참고 문서를 함께 제공했습니다. "간 수치가 경미하게 상승 범위에 있다", "이 항목은 다음 검진 전 추적 관찰이 권장되는 수치"처럼 알기 쉬운 언어로 풀어주어, 본국의 주치의와 후속 상담을 할 때도 훨씬 정확하게 소통할 수 있었습니다.<br><br>단, 이 번역 문서는 참고용이며 원본 결과지를 대체하는 공식 의료 서류가 아님을 명확히 안내받았습니다. 그럼에도 불구하고 내 몸에서 무슨 일이 일어나고 있는지를 처음으로 제대로 이해할 수 있었다는 것, 그것만으로도 CHECKIT의 가치는 충분했습니다.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>'''

# Match the entire blog-view div
pattern = r'        <!-- Blog View \(Initially Hidden\) -->\s*<div id="blog-view".*?</div>\s*\n        <!-- My Page'
replacement = new_blog + '\n\n        <!-- My Page'

result, count = re.subn(pattern, replacement, content, flags=re.DOTALL)
print(f"Replacements made: {count}")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(result)

print("Done.")
