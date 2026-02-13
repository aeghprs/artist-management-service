import {
  Button,
  type ButtonProps,
  type PolymorphicComponentProps,
} from "@mantine/core";
import {
  IconSearch,
  IconMail,
  IconArrowRight,
  IconCheck,
  IconX,
  IconPlus,
  IconTrash,
  IconEdit,
  IconDownload,
  IconUpload,
  IconLoader,
  IconLogout,
} from "@tabler/icons-react";

type IconType =
  | "search"
  | "mail"
  | "arrowRight"
  | "check"
  | "x"
  | "plus"
  | "trash"
  | "edit"
  | "download"
  | "upload"
  | "logout";

type DSButtonProps = PolymorphicComponentProps<
  "button",
  Omit<ButtonProps, "leftSection" | "rightSection"> & {
    leftIcon?: IconType;
    rightIcon?: IconType;
    isPending?: boolean;
  }
>;

const iconMap = {
  search: IconSearch,
  mail: IconMail,
  arrowRight: IconArrowRight,
  check: IconCheck,
  x: IconX,
  plus: IconPlus,
  trash: IconTrash,
  edit: IconEdit,
  download: IconDownload,
  upload: IconUpload,
  loading: IconLoader,
  logout: IconLogout,
};

export const DSButton: React.FC<DSButtonProps> = ({
  leftIcon,
  rightIcon,
  children,
  isPending = false,
  ...props
}) => {
  const LeftIconComponent = leftIcon ? iconMap[leftIcon] : null;
  const RightIconComponent = rightIcon ? iconMap[rightIcon] : null;

  return (
    <Button
      loading={isPending}
      disabled={isPending || props.disabled}
      leftSection={
        LeftIconComponent ? <LeftIconComponent size={18} /> : undefined
      }
      rightSection={
        RightIconComponent ? <RightIconComponent size={18} /> : undefined
      }
      {...props}
    >
      {children}
    </Button>
  );
};
