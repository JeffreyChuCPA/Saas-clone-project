import { env } from "@/data/env/client";


export function Banner({
  message,
  mappings,
  customization,
  canRemoveBranding
}: {
  canRemoveBranding: boolean;
  message: string;
  mappings: {
    coupon: string;
    discount: string;
    country: string;
  };
  customization: {
    backgroundColor: string;
    textColor: string;
    fontSize: string;
    isSticky: boolean;
    classPrefix?: string | null;
  };
}) {
  const prefix = customization.classPrefix ?? "";
  const mappedMessage = Object.entries(mappings).reduce(
    (mappedMessage, [key, value]) => {
      return mappedMessage.replace(new RegExp(`{${key}}`, "g"), value);
    },
    message.replace(/'/g, "&#39;")
  );

  //what is being rendered on client sites, need self containing CSS. needs to be barebone
  return (
    <>
      <style type="text/css">
        {`
          .${prefix}saas-pass-container {
            all: revert;
            display: flex;
            flex-direction: column;
            gap: .5em;
            background-color: ${customization.backgroundColor};
            color: ${customization.textColor};
            font-size: ${customization.fontSize};
            font-family: inherit;
            padding: 1rem;
            ${customization.isSticky ? "position: sticky;" : ""}
            left: 0;
            right: 0;
            top: 0;
            text-wrap: balance;
            text-align: center;
          }

          .${prefix}saas-pass-branding {
            color: inherit;
            font-size: inherit;
            display: inline-block;
            text-decoration: underline;
          }
        `}
      </style>

      <div className={`${prefix}saas-pass-container ${prefix}saas-pass-override`}>
        <span
          className={`${prefix}saas-pass-message ${prefix}saas-pass-override`}
          dangerouslySetInnerHTML={{
            __html: mappedMessage
          }}
        />
        {!canRemoveBranding && (
          <a
            className={`${prefix}saas-pass-branding`}
            href={`${env.NEXT_PUBLIC_SERVER_URL}`}>
            Powered by Easy pass
          </a>
        )}
      </div>
    </>
  );
}