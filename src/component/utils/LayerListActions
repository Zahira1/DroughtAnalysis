import LayerList from "@arcgis/core/widgets/LayerList";
import Slider from "@arcgis/core/widgets/Slider";

export default function CreateLayerList(view, selectedLayer){
    let layerList = new LayerList({
        id: "layerList",
        view: view.current,
        legendEnabled: true,
        listItemCreatedFunction: defineActions
    });

    function defineActions(event){

        const item = event.item;
        if(item.layer.layer != undefined)
        {
       if (item.layer.layer.allSublayers != undefined)
       {
        if (item.layer.type !== "group" && item.layer.type !== "sublayer" && (item.layer.layer.allSublayers.items[0].title == "Forest Sublayer" && item.layer.layer.title == "Forest" )){
            item.panel = {
                content: "legend",
                open: true
            };
        }
    }
    }
    }

    const transparencySlider = new Slider({
        container: "transparencySlider", // Assuming you have a div with id="transparencySlider" in your HTML
        min: 0,
        max: 100,
        steps: 1,
        precision: 0,
        labelsVisible: true,
        labelFormatFunction: function(value) {
          return value + "%";
        }
      });

    transparencySlider.on(["thumb-drag", "thumb-change"], function(event) {
        const opacity = 1 - (event.value / 100);
        selectedLayer.opacity = opacity;
    });
      
    return layerList;
}
