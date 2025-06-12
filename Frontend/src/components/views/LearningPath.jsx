// import React, { useCallback, useMemo } from "react";
import { ReactFlow, Controls, Background, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import PropTypes from "prop-types";
import { getLayoutedElements } from "@/utils/nodesLayout";

const LearningPath = ({ courseList }) => {

  const startNode = {
    id: "start",
    type: "default",
    data: { label: "Start your journey here" },
    position: { x: 0, y: -100 },
    style: {
      backgroundColor: "#facc15", // amber-400
      color: "#000",
      padding: 10,
      borderRadius: 12,
      fontSize: "16px",
      fontWeight: 700,
    },
  };

  const rawNodes = [startNode, ...(courseList?.map((course, index) => ({
    id: course.id,
    type: "default",
    data: { label: course.name },
    position: { x: 200 * (index % 4), y: Math.floor(index / 4) * 150 },
    style: {
      backgroundColor: course.status === "finished" ? "#60A5FA" : "#86efac",
      color: "#000",
      padding: 10,
      borderRadius: 12,
      fontWeight: 700
    },
  })) || [])];

  const allChildIds = new Set(courseList?.flatMap(course =>
    course?.childIds?.split(',').map(id => id.trim()).filter(Boolean)
  ) || []);

  const starterCourses = courseList?.filter(course => !allChildIds.has(course.id)) || [];

  const startEdges = starterCourses.map(course => ({
    id: `start-${course.id}`,
    source: "start",
    target: course.id,
    animated: true,
    style: { stroke: "#facc15" },
  }));

  const rawEdges = [
    ...startEdges,
    ...(courseList?.flatMap(course => {
      const childIdsArray = course?.childIds?.split(',').map(id => id.trim()).filter(Boolean);
      return childIdsArray?.map(childId => ({
        id: `${course.id}-${childId}`,
        source: course.id,
        target: childId,
        animated: true,
        style: { stroke: "#3b82f6" },
      })) || [];
    }) || [])
  ];

  const { nodes: initialNodes, edges: initialEdges } = getLayoutedElements(rawNodes, rawEdges);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);


  return (
    <>
      <div className="flex items-center gap-4 mb-4 text-sm font-medium text-gray-700 dark:text-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#60A5FA" }}></div>
          <span>Finished</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#86efac" }}></div>
          <span>In Progress</span>
        </div>
      </div>

      <div style={{ height: 600, width: "100%" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </>
  );
};

LearningPath.propTypes = {
    courseList: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
            link: PropTypes.string,
            status: PropTypes.string,
            avgTimeToFinish: PropTypes.number,
            childIds: PropTypes.string,
        })
    )
};

export default LearningPath;