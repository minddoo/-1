$file = "index.html"
$lines = Get-Content $file -Encoding UTF8

$insertAfter = 1381  # After closing </div> of PIPA auth-terms
$before = $lines[0..($insertAfter - 1)]
$after  = $lines[$insertAfter..($lines.Length - 1)]

$newBlock = @'

                    <!-- Legal Disclaimers (Required) -->
                    <div class="auth-terms legal-disclaimers">
                        <label class="terms-label">
                            <i class="fa-solid fa-scale-balanced"></i>
                            서비스 법적 고지사항 (Service Legal Disclaimers — Required)
                        </label>

                        <div class="legal-disclaimer-box">
                            <div class="legal-item">
                                <i class="fa-solid fa-hospital-user legal-icon"></i>
                                <p>본 서비스는 의료기관 알선·소개·유인 행위를 하지 않으며, 어떠한 중개 수수료도 취하지 않는 단순 예약 대행 서비스입니다.</p>
                            </div>
                            <div class="legal-item">
                                <i class="fa-solid fa-language legal-icon"></i>
                                <p>제공되는 번역 서비스는 결과지의 객관적인 언어적 번역일 뿐, 어떠한 의학적 소견이나 진단도 포함하지 않습니다. 정확한 의학적 판단은 반드시 전문의와 상담하십시오.</p>
                            </div>
                            <div class="legal-item">
                                <i class="fa-solid fa-gavel legal-icon"></i>
                                <p>의료법 제17조 등에 의거하여, 환자 본인이 의료기관에 방문하지 않고 대리인이 진료를 대신 받는 행위는 전면 금지되며, 본 서비스는 이를 지원하지 않습니다.</p>
                            </div>
                        </div>

                        <label class="remember-me pipa-checkbox-wrap legal-agree-wrap">
                            <input type="checkbox" id="legal-agree-1" required>
                            <span>위 3가지 법적 고지사항을 모두 확인하였으며 이에 동의합니다. (필수)</span>
                        </label>
                    </div>
'@

$combined = $before + $newBlock.Split("`n") + $after
$combined | Set-Content $file -Encoding UTF8
Write-Host "Done. Legal disclaimer block inserted."
