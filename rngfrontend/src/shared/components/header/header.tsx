import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../../../components/ui/navigation-menu";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex space-x-4 bg-gray-100 p-4 rounded-md">
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              to="/generate"
              className="px-3 py-2 rounded hover:bg-gray-200"
            >
              Генератор
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              to="/checker"
              className="px-3 py-2 rounded hover:bg-gray-200"
            >
              Чекер
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              to="/lottery"
              className="px-3 py-2 rounded hover:bg-gray-200"
            >
              Лотерея
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              to="/"
              className="px-3 py-2 rounded hover:bg-gray-200"
            >
              Главная
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Header;
