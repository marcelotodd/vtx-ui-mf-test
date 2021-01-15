import * as React from "react";
import { CrossSpaEvents } from "@vertexinc/vtx-ui-cross-spa-events";
import { IFirstLevelMenuItem } from "@vertexinc/vtx-ui-cross-spa-events/dist/schemas/sideNavigation/sideNavTypesV1";

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
      {
        title: "Sub route",
        linkUrl: "/ui/test/blah",
        dataTestId: "home/sub-route",
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

const publishMenu = () => {
  const e = new CrossSpaEvents();
  // eslint-disable-next-line no-console
  console.log("vtx-ui-mf-test emitting sideNavigation event...");
  e.emit("sideNavigation", { menu, schemaVersion: "v1" });
};

export class Root extends React.Component<OwnProps> {
  componentDidMount() {
    if (localStorage.getItem("vtx-ui-mf-test:load-menu-on-mount") === "true") {
      publishMenu();
    }
  }

  render() {
    const { name, loginUser } = this.props;

    const updateHelpLinkUrl = () => {
      const e = new CrossSpaEvents();
      e.emit("helpLinkUrlChange", {
        schemaVersion: "v1",
        url: "https://vertexinc.custhelp.com/vtx-ui-mf-test",
      });
    };

    return (
      <div style={{ padding: "20px" }}>
        <h2>{name} microfrontend</h2>
        {!loginUser ? (
          <div>No user provided. Not good!</div>
        ) : (
          <pre>{JSON.stringify(loginUser, null, 2)}</pre>
        )}
        <button
          data-testid="test-app-publish-menu"
          type="button"
          onClick={publishMenu}
        >
          Update Menu
        </button>
        <button
          data-testid="test-app-update-help-link-url"
          type="button"
          onClick={updateHelpLinkUrl}
          style={{ marginLeft: "10px" }}
        >
          Change Help Link URL
        </button>
      </div>
    );
  }
}
