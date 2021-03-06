import React, { CSSProperties } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import Section from "./Section"
import Box from "../DesignSystem/Box"

interface SideBarProps {
  sideBarRef: React.RefObject<HTMLDivElement>
  isVisible: boolean
}

interface Section {
  name: string
  subitems: JSX.Element[]
  item: JSX.Element | null
}

interface Edge {
  node: {
    id: string
    frontmatter: {
      path: string
      title: string
      order: number
      section: string
      sectionOrder: number
      unlisted: boolean
    }
  }
}

const SideBar: React.FC<SideBarProps> = props => {
  const { allMdx } = useStaticQuery(graphql`
    query SideBarQuery {
      allMdx(
        sort: {
          fields: [frontmatter___sectionOrder, frontmatter___order]
          order: ASC
        }
      ) {
        edges {
          node {
            id
            frontmatter {
              path
              title
              order
              section
              sectionOrder
              unlisted
            }
          }
        }
      }
    }
  `)

  const sectionsData: Section[] = allMdx.edges.reduce(
    (acc: Section[], edge: Edge) => {
      const {
        path,
        title,
        section,
        sectionOrder,
        order,
        unlisted,
      } = edge.node.frontmatter
      const element = (
        <Link
          className="link"
          activeStyle={{ color: "#33e" }}
          to={edge.node.frontmatter.path}
        >
          {edge.node.frontmatter.title}
        </Link>
      )
      const isNewSection = !!acc[sectionOrder]
      const isSubitem = order > 0 && !unlisted
      const item = isSubitem ? acc[sectionOrder].item : element
      const subitem = (
        <li className="subitem" key={path}>
          {element}
        </li>
      )
      let subitems: JSX.Element[]
      if (isNewSection && isSubitem) {
        subitems = [subitem]
      } else if (isSubitem) {
        subitems = [...acc[sectionOrder].subitems, subitem]
      } else {
        subitems = []
      }
      acc[sectionOrder] = { name: section, subitems, item }
      return acc
    },
    []
  )

  const sections = sectionsData.map(section => (
    <Section name={section.name} item={section.item} key={section.name}>
      <ul className="subitems">{section.subitems}</ul>
    </Section>
  ))

  return (
    <Box
      className="sections"
      display={["none", "none", "none", "block"]}
      position={["fixed", "fixed", "fixed", "inherit"]}
      zIndex={[6, 6, 6, 2]}
      bg="white"
      width={192}
      ref={props.sideBarRef}
      style={{
        display: props.isVisible ? "inline" : undefined,
      }}
    >
      {sections}
    </Box>
  )
}

export default SideBar
