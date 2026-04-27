"use client";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[520px] max-h-[80vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.15)] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-black text-gray-900">이용약관</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 border-none bg-gray-100 rounded-full cursor-pointer text-sm text-gray-400 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 약관 내용 (스크롤) */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-6">
            <section>
              <h3 className="text-[14px] font-bold text-gray-900 mb-2">제1조 (목적)</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                본 약관은 성공회대학교 사물함 관리 서비스 SKHUBox(이하 &quot;서비스&quot;)의 이용과 관련하여 서비스
                운영자와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section>
              <h3 className="text-[14px] font-bold text-gray-900 mb-2">제2조 (이용자격)</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                본 서비스는 성공회대학교 재학생 및 학교에서 인정한 관리자에 한하여 이용할 수 있습니다. 학교
                이메일(@office.skhu.ac.kr)로 인증을 완료한 사용자만 서비스를 이용할 수 있습니다.
              </p>
            </section>

            <section>
              <h3 className="text-[14px] font-bold text-gray-900 mb-2">제3조 (사물함 이용규칙)</h3>
              <div className="text-[13px] text-gray-500 leading-relaxed flex flex-col gap-1.5">
                <p>① 사물함은 1인 1칸을 원칙으로 하며, 중복 신청은 불가합니다.</p>
                <p>② 사물함 내 음식물, 위험물, 귀중품 보관은 금지됩니다.</p>
                <p>③ 배정된 사물함은 타인에게 양도하거나 대여할 수 없습니다.</p>
                <p>④ 사물함 이용 기간은 학기 단위이며, 학기 종료 시 반납해야 합니다.</p>
                <p>⑤ 이용 기간 만료 후 미반납 시 내부 물품에 대한 책임은 이용자에게 있습니다.</p>
              </div>
            </section>

            <section>
              <h3 className="text-[14px] font-bold text-gray-900 mb-2">제4조 (관리자 권한)</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                관리자는 사물함 배정, 해제, 상태 변경, 민원 처리 등의 권한을 가지며, 서비스 운영에 필요한 경우 이용자의
                사물함을 강제 해제할 수 있습니다. 이 경우 사전 공지를 원칙으로 합니다.
              </p>
            </section>

            <section>
              <h3 className="text-[14px] font-bold text-gray-900 mb-2">제5조 (개인정보 처리)</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                서비스 이용을 위해 수집되는 개인정보(이름, 학번, 학부, 이메일)는 사물함 관리 목적으로만 사용되며, 서비스
                탈퇴 시 즉시 파기됩니다.
              </p>
            </section>

            <section>
              <h3 className="text-[14px] font-bold text-gray-900 mb-2">제6조 (면책사항)</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                천재지변, 시스템 장애 등 불가항력적인 사유로 인한 서비스 중단에 대해 운영자는 책임을 지지 않습니다.
                사물함 내 보관물의 분실, 파손에 대한 책임은 이용자에게 있습니다.
              </p>
            </section>
          </div>
        </div>

        {/* 하단 */}
        <div className="p-6 pt-4 border-t border-gray-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 border-none rounded-xl bg-gradient-to-br from-[#3a7d5c] to-[#5cb882] text-white text-[14px] font-bold font-sans cursor-pointer hover:opacity-90 transition-opacity"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
