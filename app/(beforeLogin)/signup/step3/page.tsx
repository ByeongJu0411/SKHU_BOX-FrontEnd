import { Suspense } from "react";
import SignupStep3 from "./_component/step3";

export default function Page() {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <SignupStep3 />
    </Suspense>
  );
}
