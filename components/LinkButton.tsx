import {
  Button,
  ButtonProps,
  IconButton,
  IconButtonProps,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { ReactNode } from "react";

interface ILink {
  href: string;
  passHref?: boolean;
}

interface ILinkAsButton extends ILink, ButtonProps {
  buttonType?: "button";
  children: ReactNode;
}

interface ILinkAsIconButton extends ILink, IconButtonProps {
  buttonType: "iconButton";
}

export type ILinkButton = ILinkAsButton | ILinkAsIconButton;

export const isLinkAsButton = (
  type: "button" | "iconButton",
  props: ButtonProps | IconButtonProps
): props is Omit<ILinkAsButton, "href" | "passHref"> => type === "button";

export const LinkButton = (props: ILinkButton) => {
  const { href, passHref, buttonType = "button", ...rest } = props;
  return (
    <Link passHref={passHref} href={href}>
      {isLinkAsButton(buttonType, rest) ? (
        <Button {...rest}>{`children ${rest.children}`}</Button>
      ) : (
        <IconButton {...(rest as IconButtonProps)} />
      )}
    </Link>
  );
};
