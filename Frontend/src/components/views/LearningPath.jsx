// import React, { useCallback, useMemo } from "react";
import { ReactFlow, Controls, Background, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import PropTypes from "prop-types";
import { courseNodes } from "@/mock/data";
import { getLayoutedElements } from "@/utils/nodesLayout";

const LearningPath = ({ roadmapId }) => {
  const courses = courseNodes.filter(c => c.roadmapId === roadmapId);

  const rawNodes = courses.map((course, index) => ({
    id: course.id,
    type: "default",
    data: { label: course.name },
    position: { x: 200 * (index % 4), y: Math.floor(index / 4) * 150 },
    style: {
      backgroundColor: course.status === "finished" ? "#60A5FA" : "#86efac",
      color: "#000",
      padding: 10,
      borderRadius: 12,
    },
  }));

  const rawEdges = courses.flatMap(course =>
    course.childs.map(childId => ({
      id: `${course.id}-${childId}`,
      source: course.id,
      target: childId,
      animated: true,
      style: { stroke: "#3b82f6" },
    }))
  );

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
    roadmapId: PropTypes.string.isRequired,
};

export default LearningPath;