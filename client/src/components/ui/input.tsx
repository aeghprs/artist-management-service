import { TextInput, type TextInputProps } from "@mantine/core";
import {
  IconSearch,
  IconMail,
  IconUser,
  IconPhone,
  IconMapPin,
} from "@tabler/icons-react";

type IconType = "search" | "mail" | "user" | "phone" | "mapPin";

interface DSInputProps extends Omit<
  TextInputProps,
  "leftSection" | "rightSection"
> {
  leftIcon?: IconType;
  rightIcon?: IconType;
}

const iconMap = {
  search: IconSearch,
  mail: IconMail,
  user: IconUser,
  phone: IconPhone,
  mapPin: IconMapPin,
};

export const DSInput: React.FC<DSInputProps> = ({
  leftIcon,
  rightIcon,
  ...props
}) => {
  const LeftIconComponent = leftIcon ? iconMap[leftIcon] : null;
  const RightIconComponent = rightIcon ? iconMap[rightIcon] : null;

  return (
    <TextInput
      leftSection={
        LeftIconComponent ? <LeftIconComponent size={18} /> : undefined
      }
      rightSection={
        RightIconComponent ? <RightIconComponent size={18} /> : undefined
      }
      {...props}
    />
  );
};
