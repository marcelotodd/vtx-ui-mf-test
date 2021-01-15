import * as React from "react";
import { CrossSpaEvents } from "@vertexinc/vtx-ui-cross-spa-events";
import { IconType } from "@vertexinc/vtx-ui-cross-spa-events/dist/schemas/sideNavigation/iconTypes";
import {
  IFirstLevelMenuItem,
  IOneOrManyMenuItems,
} from "@vertexinc/vtx-ui-cross-spa-events/dist/schemas/sideNavigation/sideNavTypesV1";

interface OwnProps {
  name: string;
  loginUser: any;
}

const menu: IFirstLevelMenuItem[] = [
  {
    title: "Home",
    dataTestId: "home",
    icon: {
      typeName: "enterprise",
    },
    children: [
      {
        title: "Bad route",
        linkUrl: "/ui/blah",
        dataTestId: "home/bad-route",
      },
    ],
  },
  {
    title: "Settings",
    dataTestId: "settings",
    icon: {
      typeName: "setting",
    },
    children: [
      {
        title: "Calc Config",
        linkUrl: "/ui/calc-config",
        dataTestId: "settings/calc-config",
      },
    ],
  },
];

export class Root extends React.Component<OwnProps> {
  componentDidMount() {
    console.log("vtx-ui-mf-test mounted");
  }

  render() {
    const { name, loginUser } = this.props;

    const publishMenu = () => {
      const e = new CrossSpaEvents();
      e.emit("sideNavigation", { menu, schemaVersion: "v1" });
    };

    return (
      <div style={{ padding: "20px" }}>
        <p>
          <h2>{name} microfrontend</h2>
          {!loginUser ? (
            <div>No user provided. Not good!</div>
          ) : (
            <pre>{JSON.stringify(loginUser, null, 2)}</pre>
          )}
        </p>
        <button
          data-testid="test-app-publish-menu"
          type="button"
          onClick={publishMenu}
        >
          Update Menu
        </button>
      </div>
    );
  }
}
