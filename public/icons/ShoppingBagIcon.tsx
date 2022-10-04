import { Icon, IconProps } from "@chakra-ui/icons";
import { FC } from "react";

export const ShoppingBagIcon: FC<IconProps> = (props = {}) => (
  <Icon stroke="white" {...props}>
    <path
      fill="currentColor"
      d="M3.5 1.1665L1.75 3.49984V11.6665C1.75 11.9759 1.87292 12.2727 2.09171 12.4915C2.3105 12.7103 2.60725 12.8332 2.91667 12.8332H11.0833C11.3928 12.8332 11.6895 12.7103 11.9083 12.4915C12.1271 12.2727 12.25 11.9759 12.25 11.6665V3.49984L10.5 1.1665H3.5Z"
    />
    <path fill="currentColor" d="M1.75 3.5H12.25" />
    <path
      fill="currentColor"
      d="M9.33317 5.8335C9.33317 6.45233 9.08734 7.04583 8.64975 7.48341C8.21217 7.921 7.61868 8.16683 6.99984 8.16683C6.381 8.16683 5.78751 7.921 5.34992 7.48341C4.91234 7.04583 4.6665 6.45233 4.6665 5.8335"
    />
  </Icon>
);
