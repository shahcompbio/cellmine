# Cellmine

Cellmine is a resource of thousands of single cell genomes from a variety of tissue types. It features the data presented in the DLP+ resource paper.

[Montage](https://github.com/shahcompbio/montage), a web-based interactive visualization platform for real-time browsing of single cell genomes, is used to display these data. Montage shares computational single-cell copy number predictions and associated quality metrics both internally and publicly.

## Single Cell Genomics

Direct library preparation (DLP+) enables the production of thousands of high quality single cell genome libraries in a single experiment for the analysis of whole and partial chromosomal alterations at single-cell resolution. We isolate the cells in microwell chips, and prepare their DNA to be uniquely barcoded to maintain the identity of the cell prior to pooling the DNA for sequencing. From this data we can determine the copy number profile of single cells based on their chromosomal alterations, then pool the genomes of cells derived from a common ancestor to do pseudobulk analysis on these populations. DLP+ enables the researcher to get a higher depth subclone genome, as well as detect rare cell populations.

<div id="montage-img">

![DLP+](static/media/fig1.ebda91c9.png)

</div>

## How to interact with the data on Cellmine

![Montage](static/media/fig2.28a266c5.png)
Single cell libraries are accessible from the search menu at the top of the screen. Once a library is selected it can be filtered by quality metrics or conditions using by accessing the Dataset Filters via the green circle in the menu on the left.
<br/>

<div class="subTitle topMargin">

_Standard plots:_

</div>
<div class="plotContent">

* _Cellscape:_ displays a heatmap of single cell genomes on the y-axis and chromosomes on the x- axis, with copy number alterations represented with colours, as well as an interactive slider to move down the heatmap thumbnail. You can hover over a single cell in the heatmaps to view its copy number profile in detail in the panel below. You can click and select multiple cells and export their cell IDs or a pdf of their copy number profiles by clicking the menu in the top right corner of Cellscape.
* _Scatterplot:_ dots represent a single cell. Histograms along the side represent the density of the cells, with the x and y-axis metrics selectable by the user in the left menu after selecting the plot.
* _Chip Heatmap:_ represents the nanowell chip where single-cell libraries are constructed, giving a spatial colour display of sequencing metrics selectable by the user in the left menu after selecting the plot.
* _Violin Plot:_ the x and y-axis metrics are selectable by the user in the left menu after selecting the plot.
* _Metadata Table:_ tabular display of metadata about an experiment to allow you to interpret the experimental conditions and controls. In experiments where DLP+ was being optimized, there are alterations to various reaction parameters such as lysis buffer type and time, which can be viewed here. In all standard libraries, you can view the metadata for controls here as well.

</div>

<div class="subTitle">

_Terms for library metadata experimental conditions:_

</div>

<div class="plotContent">

* _GM:_ GM18507 human male diploid cell line included as an internal positive control in all libraries to check library construction performance on a normal genome.
* _gDNA:_ as an internal positive control in all libraries to check the chip row by row for library construction performance by read count. If the sample id is SA1015, this is salmon gDNA.
* _NCC:_ no cell control, negative control that samples the buffer around the cells for background contamination.
* _NTC:_ no template control, no cell or DNA was dispensed in the well to check for reagent contamination.

</div>

<div class="subTitle">

_Terms for cell call:_

</div>

<div class="plotContent">

* _C1:_ denotes a live cell
* _C2:_ denotes a dead cell, or a nucleus

</div>

## Acknowledgements

The work described and the laboratories of SA and SS supported by BC Cancer Foundation, Canadian Institutes for Health Research (CIHR), Canadian Cancer Society Research Institute (CCSRI), Terry Fox Research Institute (TFRI), Canadian Foundation for Innovation (CFI), Canada Research Chairs program, Michael Smith Foundation for Health Research (MSFHR), Microsoft Canada, Cancer Research UK Grand challenge IMAXT award (CRUK).
