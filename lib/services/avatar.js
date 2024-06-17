import avatars from "../static-data/avatars";
import avatarColors from "../static-data/avatar-colors";

const avatarService = {
  findColor: (id) => {
    const colorObject = avatarColors.find((color) => color.id === id);

    return colorObject ? colorObject.hex : null;
  },
  findAvatar: (id) => {
    const avatarObject = avatars.find((avatar) => avatar.id === id);

    return avatarObject ? avatarObject.icon : null;
  },
};

export default avatarService;
