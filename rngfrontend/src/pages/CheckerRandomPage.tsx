import CheckerRandomForm from "@/widgets/components/Forms/CheckerRandomForm";
import { useState } from "react";
import type { AuditTest } from "@/shared/interafaces/interfaces";

const CheckerRandomPage = () => {
  const [auditResults, setAuditResults] = useState<AuditTest[] | null>(null);

  return (
    <div className="fixed left-1/2 bottom-[max(16px,env(safe-area-inset-bottom))] z-50 w-[min(760px,calc(100vw-24px))] -translate-x-1/2 pointer-events-none">
      {auditResults && (
        <div className="mb-2 w-full max-w-[760px] mx-auto">
          {" "}
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <h3 className="mb-3 text-lg font-semibold text-cyan-300 flex items-center gap-2">
              <span>📊</span> Результаты статистических тестов
            </h3>
            <div className="space-y-3">
              {auditResults.map((test, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-white/5 bg-white/2 bg-opacity-5 p-3 backdrop-blur-sm"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-medium text-white">{test.name}</h4>
                      <p className="text-xs text-zinc-400 mt-1">
                        {test.description}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        test.result
                          ? "bg-green-500/20 text-green-300 border border-green-500/30"
                          : "bg-red-500/20 text-red-300 border border-red-500/30"
                      }`}
                    >
                      {test.result ? "Пройден" : "Не пройден"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <CheckerRandomForm
        onAuditSuccess={(data) => setAuditResults(data)}
        onAuditError={() => setAuditResults(null)}
      />
    </div>
  );
};

export default CheckerRandomPage;
