import { NOTICE_STYLES } from "../../lib/doorflow/constants";
import { Notice } from "../../lib/doorflow/types";

type NoticeBannerProps = {
  notice: Notice | null;
  className?: string;
};

export function NoticeBanner({ notice, className = "" }: NoticeBannerProps) {
  if (!notice) {
    return null;
  }

  return (
    <div
      className={`rounded-xl border px-3 py-2 text-sm ${
        NOTICE_STYLES[notice.tone]
      } ${className}`.trim()}
    >
      <p>{notice.message}</p>
      {notice.ticketCode ? (
        <p className="mt-1 font-mono text-base font-semibold">
          {notice.ticketCode}
        </p>
      ) : null}
    </div>
  );
}
