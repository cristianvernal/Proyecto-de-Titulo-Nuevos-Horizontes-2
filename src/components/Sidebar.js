import {
  Avatar,
  Badge,
  Chip,
  Collapse,
  Drawer as MuiDrawer,
  Grid,
  List as MuiList,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { darken, rgba } from "polished";
import React, { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useSelector } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";
import styled from "styled-components/macro";
// import { green } from "@material-ui/core/colors";
import { sidebarRoutes as routes } from "../routes/index";
import logo from "../vendor/logotipo.png";
import "../vendor/perfect-scrollbar.css";
import logoDemanda from "../vendor/LogoDemanda.svg";
import icon from "../vendor/icon.png"

const Drawer = styled(MuiDrawer)`
  border-right: 0;

  > div {
    border-right: 0;
  }
`;

const Scrollbar = styled(PerfectScrollbar)`
  background-color: ${(props) => props.theme.sidebar.background};
  border-right: 1px solid rgba(0, 0, 0, 0.12);
`;

const List = styled(MuiList)`
  background-color: ${(props) => props.theme.sidebar.background};
`;

const Items = styled.div`
  padding-top: ${(props) => props.theme.spacing(2.5)}px;
  padding-bottom: ${(props) => props.theme.spacing(2.5)}px;
`;

const Brand = styled(ListItem)`
  font-size: ${(props) => props.theme.typography.h5.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
  color: ${(props) => props.theme.sidebar.header.color};
  background-color: ${(props) => "white"};
  font-family: ${(props) => props.theme.typography.fontFamily};
  min-height: 56px;
  padding-left: ${(props) => props.theme.spacing(6)}px;
  padding-right: ${(props) => props.theme.spacing(6)}px;
  justify-content: center;
  cursor: pointer;

  ${(props) => props.theme.breakpoints.up("sm")} {
    min-height: 64px;
  }
`;

// const BrandIcon = styled(Logo)`
//   margin-right: ${(props) => props.theme.spacing(2)}px;
//   color: ${(props) => props.theme.sidebar.header.brand.color};
//   fill: ${(props) => props.theme.sidebar.header.brand.color};
//   height: 50px;
//   width: 100px;
// `;

// const BrandChip = styled(Chip)`
//   background-color: ${green[700]};
//   border-radius: 5px;
//   color: ${(props) => props.theme.palette.common.white};
//   font-size: 55%;
//   height: 18px;
//   margin-left: 2px;
//   margin-top: -16px;
//   padding: 3px 0;

//   span {
//     padding-left: ${(props) => props.theme.spacing(1.375)}px;
//     padding-right: ${(props) => props.theme.spacing(1.375)}px;
//   }
// `;

const Category = styled(ListItem)`
  padding-top: ${(props) => props.theme.spacing(3)}px;
  padding-bottom: ${(props) => props.theme.spacing(3)}px;
  padding-left: ${(props) => props.theme.spacing(8)}px;
  padding-right: ${(props) => props.theme.spacing(7)}px;
  font-weight: ${(props) => props.theme.typography.fontWeightRegular};

  svg {
    color: ${(props) => props.theme.sidebar.color};
    font-size: 20px;
    width: 20px;
    height: 20px;
    opacity: 0.5;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }

  &.${(props) => props.activeClassName} {
    background-color: ${(props) =>
      darken(0.03, props.theme.sidebar.background)};

    span {
      color: ${(props) => props.theme.sidebar.color};
    }
  }
`;

const CategoryText = styled(ListItemText)`
  margin: 0;
  span {
    color: ${(props) => props.theme.sidebar.color};
    font-size: ${(props) => props.theme.typography.body1.fontSize}px;
    padding: 0 ${(props) => props.theme.spacing(4)}px;
  }
`;

const CategoryIconLess = styled(ExpandLess)`
  color: ${(props) => rgba(props.theme.sidebar.color, 0.5)};
`;

const CategoryIconMore = styled(ExpandMore)`
  color: ${(props) => rgba(props.theme.sidebar.color, 0.5)};
`;

const Link = styled(ListItem)`
  padding-left: ${(props) => props.theme.spacing(17.5)}px;
  padding-top: ${(props) => props.theme.spacing(2)}px;
  padding-bottom: ${(props) => props.theme.spacing(2)}px;

  span {
    color: ${(props) => rgba(props.theme.sidebar.color, 0.7)};
  }

  &:hover span {
    color: ${(props) => rgba(props.theme.sidebar.color, 0.9)};
  }

  &:hover {
    background-color: ${(props) =>
      darken(0.015, props.theme.sidebar.background)};
  }

  &.${(props) => props.activeClassName} {
    background-color: ${(props) =>
      darken(0.03, props.theme.sidebar.background)};

    span {
      color: ${(props) => props.theme.sidebar.color};
    }
  }
`;

const LinkText = styled(ListItemText)`
  color: ${(props) => props.theme.sidebar.color};
  span {
    font-size: ${(props) => props.theme.typography.body1.fontSize}px;
  }
  margin-top: 0;
  margin-bottom: 0;
`;

const LinkBadge = styled(Chip)`
  font-size: 11px;
  font-weight: ${(props) => props.theme.typography.fontWeightBold};
  height: 20px;
  position: absolute;
  right: 28px;
  top: 8px;
  background: ${(props) => props.theme.sidebar.badge.background};

  span.MuiChip-label,
  span.MuiChip-label:hover {
    cursor: pointer;
    color: ${(props) => props.theme.sidebar.badge.color};
    padding-left: ${(props) => props.theme.spacing(2)}px;
    padding-right: ${(props) => props.theme.spacing(2)}px;
  }
`;

const CategoryBadge = styled(LinkBadge)`
  top: 12px;
`;

const SidebarSection = styled(Typography)`
  color: ${(props) => props.theme.sidebar.color};
  padding: ${(props) => props.theme.spacing(4)}px
    ${(props) => props.theme.spacing(7)}px
    ${(props) => props.theme.spacing(1)}px;
  opacity: 0.9;
  display: block;
`;

const SidebarFooter = styled.div`
  background-color: ${(props) =>
    props.theme.sidebar.footer.background} !important;
  padding: ${(props) => props.theme.spacing(2.75)}px
    ${(props) => props.theme.spacing(4)}px;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
`;

const SidebarFooterText = styled(Typography)`
  color: ${(props) => props.theme.sidebar.footer.color};
`;

const SidebarFooterSubText = styled(Typography)`
  color: ${(props) => props.theme.sidebar.footer.color};
  font-size: 0.7rem;
  display: block;
  padding: 1px;
`;

const SidebarFooterBadge = styled(Badge)`
  margin-right: ${(props) => props.theme.spacing(1)}px;
  span {
    background-color: ${(props) =>
      props.theme.sidebar.footer.online.background};
    border: 1.5px solid ${(props) => props.theme.palette.common.white};
    height: 12px;
    width: 12px;
    border-radius: 50%;
  }
`;

const SidebarCategory = ({
  name,
  icon,
  classes,
  isOpen,
  isCollapsable,
  badge,
  ...rest
}) => {
  return (
    <Category {...rest}>
      {icon}
      <CategoryText>{name}</CategoryText>
      {isCollapsable ? (
        isOpen ? (
          <CategoryIconMore />
        ) : (
          <CategoryIconLess />
        )
      ) : null}
      {badge ? <CategoryBadge label={badge} /> : ""}
    </Category>
  );
};

const SidebarLink = ({ name, to, badge, icon }) => {
  return (
    <Link button dense component={NavLink} to={to} activeClassName="active">
      <LinkText>{name}</LinkText>
      {badge ? <LinkBadge label={badge} /> : ""}
    </Link>
  );
};

const Sidebar = ({ classes, staticContext, location, ...rest }) => {
  const initOpenRoutes = () => {
    /* Open collapse element that matches current url */
    const pathName = location.pathname;

    let _routes = {};
    routes.forEach((route, index) => {
      const isActive = pathName.indexOf(route.path) === 0;
      const isOpen = route.open;

      _routes = {
        ..._routes,
        [index]: isActive || isOpen,
      };
    });
    return _routes;
  };
  const [openRoutes, setOpenRoutes] = useState(() => initOpenRoutes());

  const initOpenSubRoutes = () => {
    /* Open collapse element that matches current url */
    const pathName = location.pathname;

    let _routes = {};
    routes.forEach((route, index) => {
      if (route.children) {
        route.children.forEach((subRoute, subIndex) => {
          const isActive = pathName.indexOf(subRoute.path) === 0;
          _routes = {
            ..._routes,
            [subIndex]: isActive,
          };
        });
      }
    });
    return _routes;
  };

  const [openSubRoutes, setOpenSubRoutes] = useState(() => initOpenSubRoutes());

  const toggle = (index, subIndex) => {
    console.log(`index ${index}, subIndex ${subIndex} `);
    if (subIndex >= 0) {
      Object.keys(openSubRoutes).forEach(
        (item) =>
          openSubRoutes[subIndex] ||
          setOpenSubRoutes((openRoutes) => ({
            ...openRoutes,
            [item]: false,
          }))
      );

      setOpenSubRoutes((openSubRoutes) => ({
        ...openSubRoutes,
        [subIndex]: !openSubRoutes[subIndex],
      }));
    } else {
      // Collapse all elements
      Object.keys(openRoutes).forEach(
        (item) =>
          openRoutes[index] ||
          setOpenRoutes((openRoutes) => ({
            ...openRoutes,
            [item]: false,
          }))
      );
      // Toggle selected element
      setOpenRoutes((openRoutes) =>
        Object.assign({}, openRoutes, { [index]: !openRoutes[index] })
      );
    }
  };

  const { user } = useSelector((state) => state.authReducer);

  return (
    <Drawer variant="permanent" {...rest}>
      <Brand component={NavLink} to="/" button>
       <div style={{backgroundImage:`url('${logoDemanda}')`,width:192, height:64}}></div> 
      </Brand>
      <Scrollbar>
        <List disablePadding>
          <Items>
            {routes.map((category, index) => (
              <React.Fragment key={index}>
                {category.header ? (
                  <SidebarSection>{category.header}</SidebarSection>
                ) : null}

                {category.children && category.icon ? (
                  <React.Fragment key={index}>
                    <SidebarCategory
                      isOpen={!openRoutes[index]}
                      isCollapsable={true}
                      name={category.id}
                      icon={category.icon}
                      button={true}
                      onClick={() => toggle(index)}
                    />

                    <Collapse
                      in={openRoutes[index]}
                      timeout="auto"
                      unmountOnExit
                    >
                      {category.children.map((route, i2) => {
                        if (route.children) {
                          return (
                            <React.Fragment key={route.id}>
                              <SidebarCategory
                                isOpen={!openSubRoutes[i2]}
                                isCollapsable={true}
                                name={route.id}
                                icon={null}
                                button={true}
                                onClick={() => toggle(index, i2)}
                              />
                              <Collapse
                                in={openSubRoutes[i2]}
                                timeout="auto"
                                unmountOnExit
                              >
                                {route.children.map((r, i3) => (
                                  <React.Fragment key={i3}>
                                    <SidebarLink
                                      name={r.name}
                                      to={r.path}
                                      icon={r.icon}
                                      badge={r.badge}
                                    />
                                  </React.Fragment>
                                ))}
                              </Collapse>
                            </React.Fragment>
                          );
                        }

                        return (
                          <React.Fragment key={i2}>
                            <SidebarLink
                              name={route.name}
                              to={route.path}
                              icon={route.icon}
                              badge={route.badge}
                            />
                          </React.Fragment>
                        );
                      })}
                    </Collapse>
                  </React.Fragment>
                ) : category.icon ? (
                  <SidebarCategory
                    isCollapsable={false}
                    name={category.id}
                    to={category.path}
                    activeClassName="active"
                    component={NavLink}
                    icon={category.icon}
                    exact
                    button
                    badge={category.badge}
                  />
                ) : null}
              </React.Fragment>
            ))}
          </Items>
        </List>
      </Scrollbar>
      <SidebarFooter>
        <Grid container spacing={2}>
          <Grid item>
            <SidebarFooterBadge
              overlap="circle"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              variant="dot"
            >
              <Avatar alt="user avatar" src={user?.image} />
            </SidebarFooterBadge>
          </Grid>
          <Grid item>
            <SidebarFooterText variant="body2">{user?.name}</SidebarFooterText>
            <SidebarFooterSubText variant="caption">
              {user?.email}
            </SidebarFooterSubText>
          </Grid>
        </Grid>
      </SidebarFooter>
    </Drawer>
  );
};

export default withRouter(Sidebar);
