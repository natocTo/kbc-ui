import d3 from 'd3';
import dagreD3 from 'dagre-d3';
import _ from 'underscore';

class Graph {
  constructor(data, wrapperElement) {
    this.getData = this.getData.bind(this);
    this.createSvg = this.createSvg.bind(this);
    this.data = data;
    this.zoom =
      {scale: 1};

    this.position = {
      x: 0,
      y: 0
    };

    this.spacing = 2;

    this.styles = {};

    this.dimensions = {
      height: 0,
      width: 0
    };

    this.position = {
      x: 0,
      y: 0
    };

    this.defaultPosition = {
      x: 0,
      y: 0
    };

    this.svgTemplate = '<svg width="0" height="0" id="svgGraph" class="kb-graph"></svg>';

    wrapperElement.innerHTML = this.svgTemplate;
    this.element = wrapperElement.childNodes[0];
  }

  getData(config) {
    const localConfig = {noLinks: false, ...config};
    const data = new dagreD3.Digraph();
    for (var i in this.data.nodes) {
      if (localConfig.noLinks) {
        data.addNode(this.data.nodes[i].node,
          {label: this.data.nodes[i].label});
      } else {
        data.addNode(this.data.nodes[i].node,
          {label: `<a href="${this.data.nodes[i].link}">${this.data.nodes[i].label}</a>`});
      }
    }

    this.data.transitions.forEach((transition) => {
      data.addEdge(null, transition.source, transition.target,
        {type: transition.type});
    });
    return data;
  }

  createSvg(svg, data, config, centerNodeId) {
    svg.selectAll('*').remove();
    const localConfig = {noLinks: false, ...config};
    const renderer = new dagreD3.Renderer();
    const graph = this;
    let gEdges = {};

    const oldDrawEdgePaths = renderer.drawEdgePaths();
    renderer.drawEdgePaths(function(g, u) {
      g.graph().arrowheadFix = false;
      const edgePaths = oldDrawEdgePaths(g, u);
      gEdges = g._edges;
      return edgePaths;
    });

    if (localConfig.noLinks) {
      const oldDrawNodes = renderer.drawNodes();
      renderer.drawNodes(function(g, u) {
        const nodes = oldDrawNodes(g, u);
        // adjust boxes
        nodes[0].forEach( function(node) {
          const rect = d3.select(node).select('rect');
          rect
            .attr('width', rect.attr('width') - 12)
            .attr('height', rect.attr('height') - 18)
            .attr('x', -(rect.attr('width') / 2) + 1)
            .attr('y', -(rect.attr('height') / 2));
          const textWrapper = d3.select(node).select('g');
          textWrapper
            .attr('transform', `translate(-${(rect.attr('width') / 2) - 4}, -${(rect.attr('height') / 2) - 2})`);
          const text = d3.select(node).select('text');
          return text.attr('text-anchor', null);
        });
        return nodes;
      });
    }

    const layoutConfig = dagreD3.layout().rankDir('LR').nodeSep(10 * this.spacing).edgeSep(10 * this.spacing).rankSep(20 * this.spacing);
    const layout = renderer.zoom(false).layout(layoutConfig).run(data, svg.append('g'));

    // assign edge classes according to node types
    const transitionClassMap = [];
    _.each(_.uniq(_.pluck(graph.data.transitions, 'type')), transitionType => {
      transitionClassMap[transitionType] = id => gEdges[id].value.type === transitionType;
    });
    d3.selectAll('g.edgePath').classed(transitionClassMap);

    // assign node classes according to node types
    const nodeClassMap = [];
    _.each(_.uniq(_.pluck(graph.data.nodes, 'type')), nodeType => {
      nodeClassMap[nodeType] = function(id) {
        let result = false;
        graph.data.nodes.forEach(function(dataNode) {
          if ((dataNode.node === id) && (dataNode.type === nodeType)) {
            result = true;
          }
        });
        return result;
      };
    });
    d3.selectAll('g.node').classed(nodeClassMap);

    // apply styeles
    _.each(this.styles, (styles, selector) =>
      _.each(styles, (value, property) => d3.selectAll(selector).style(property, value))
    );

    this.dimensions = {
      width: layout.graph().width,
      height: layout.graph().height
    };

    if (centerNodeId && layout._nodes[centerNodeId]) {
      this.defaultPosition.x = -layout._nodes[centerNodeId].value.x + (this.getCanvasWidth() / 2);
      this.defaultPosition.y = -layout._nodes[centerNodeId].value.y + (this.getCanvasHeight() / 2);
    }
  }


  zoomIn() {
    const prevZoomScale = this.zoom.scale;
    this.zoom.scale = Math.min(1.75, this.zoom.scale + 0.25);
    const factor = this.zoom.scale / prevZoomScale;
    if (factor !== 1) {
      this.position.x = ((this.position.x - (this.getCanvasWidth() / 2)) * factor) + (this.getCanvasWidth() / 2);
      this.position.y = ((this.position.y - (this.getCanvasHeight() / 2)) * factor) + (this.getCanvasHeight() / 2);
    }
    return this.setTransform();
  }

  zoomOut() {
    const prevZoomScale = this.zoom.scale;
    this.zoom.scale = Math.max(0.5, this.zoom.scale - 0.25);
    const factor = this.zoom.scale / prevZoomScale;
    if (factor !== 1) {
      this.position.x = ((this.position.x - (this.getCanvasWidth() / 2)) * factor) + (this.getCanvasWidth() / 2);
      this.position.y = ((this.position.y - (this.getCanvasHeight() / 2)) * factor) + (this.getCanvasHeight() / 2);
    }
    return this.setTransform();
  }

  reset() {
    this.position.x = this.defaultPosition.x;
    this.position.y = this.defaultPosition.y;
    this.zoom.scale = 1;
    return this.setTransform();
  }

  getCanvasHeight() {
    return Math.min(500, Math.max(200, this.dimensions.height * this.zoom.scale));
  }

  getCanvasWidth() {
    return this.element.parentNode.offsetWidth;
  }

  setTransform() {
    const translateExpression = `translate(${[this.position.x, this.position.y]}), scale(${this.zoom.scale})`;
    d3.select(this.element).select('g').attr('transform', translateExpression);
    // adjust canvas height
    return d3.select(this.element).attr('height', this.getCanvasHeight());
  }

  adjustCanvasWidth() {
    return d3.select(this.element).attr('width', this.getCanvasWidth());
  }

  render(centerNodeId) {
    const data = this.getData();

    this.adjustCanvasWidth();

    if (data) {
      const svg = d3.select(this.element);
      const graph = this;

      this.createSvg(svg, data, {}, centerNodeId);
      this.reset();

      // init position + dragging
      svg.call(d3.behavior.drag().origin(function() {
        const t = svg.select('g');
        return {
          x: t.attr('x') + d3.transform(t.attr('transform')).translate[0],
          y: t.attr('y') + d3.transform(t.attr('transform')).translate[1]
        };
      }).on('drag', function() {
        graph.position.x = d3.event.x;
        graph.position.y = d3.event.y;
        return svg.select('g').attr('transform', () => `translate(${[d3.event.x, d3.event.y]}), scale(${graph.zoom.scale})`);
      })
      );
    }

    return false;
  }
}

export default Graph;
