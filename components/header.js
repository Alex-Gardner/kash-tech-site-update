/* eslint-env es6 */
/* eslint-disable no-console */

// Web Components attempt
// class Header extends HTMLElement {
//     constructor() {
//         super();
//     }
//     connectedCallbak() {

//         this.innerHTML = `

//         `
//     }
// }

// const linkElem = document.createElement('link');
// linkElem.setAttribute('rel', 'stylesheet');
// linkElem.setAttribute('href', 'style.css');

// shadow.appendChild(linkElem);

// customElements.define('header-component', Header);

const headerHolder = document.querySelector("#site-header-holder");

const headerContent = document.createElement("header");

headerContent.classList.add("component-site-header");

headerContent.innerHTML = `
<div class="wide-screen-holder">
    <div class="logo-icon-holder">
        <a aria-label="Link Icond to Home Page" href="/" class="home-page-link">
            <svg alt="KASH Tech Icon" class="company-logo header-home-icon" width="2982" height="1180" viewBox="0 0 2982 1180" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path class="logo__orange-content" fill-rule="evenodd" clip-rule="evenodd" d="M1558.73 1.14767C1508.38 2.34642 1445.62 4.77019 1409.98 6.88769C1396.74 7.66644 1373.77 9.00517 1358.93 9.84517C1316.38 12.2689 1266.46 15.4977 1247.37 17.0552C1237.75 17.8427 1221.02 19.1552 1210.18 19.9777C1174.41 22.6989 1135.3 25.8839 1120.5 27.3014C1112.48 28.0627 1097.71 29.3927 1087.68 30.2589C1077.67 31.1164 1063.55 32.4202 1056.33 33.1552C1049.11 33.8902 1038.29 34.8789 1032.27 35.3427C1021.89 36.1564 1010.4 37.2939 980.496 40.4702C973.278 41.2402 957.528 42.8677 945.496 44.0927C927.533 45.9127 863.911 52.8952 805.496 59.4577C771.398 63.2814 732.591 68.3914 717.27 71.0777C712.86 71.8564 703.016 73.4664 695.395 74.6652C665.024 79.4514 632.448 84.9902 609.356 89.3039C602.54 90.5814 593.676 92.2089 589.669 92.9177C558.939 98.3864 477.8 115.37 446.02 122.991C437.594 125.013 426.77 127.576 421.958 128.688C411.029 131.208 357.89 144.473 346.121 147.623C341.309 148.909 331.141 151.613 323.52 153.625C302.31 159.243 283.813 164.379 279.77 165.77C277.766 166.461 272.516 168.036 268.106 169.27C263.696 170.504 253.188 173.566 244.77 176.078C236.353 178.58 225.844 181.66 221.434 182.903C217.024 184.154 209.805 186.35 205.395 187.794C200.985 189.229 186.548 193.788 173.309 197.918C160.079 202.048 147.934 206.011 146.333 206.738C144.731 207.455 137.513 210.019 130.294 212.434C123.075 214.849 108.638 219.845 98.2077 223.546C87.7777 227.239 77.6102 230.774 75.6065 231.404C71.6777 232.646 51.2202 240.408 20.919 252.15C-7.92102 263.324 -6.70477 264.593 23.1065 254.434C51.9027 244.616 96.5365 231.036 127.371 222.706C182.286 207.866 253.441 190.253 289.246 182.614C306.711 178.895 313.633 177.364 325.34 174.625C333.915 172.621 356.613 167.984 382.583 162.935C394.614 160.599 407.739 158.009 411.746 157.178C415.763 156.346 427.899 154.028 438.731 152.033C449.555 150.029 462.024 147.719 466.434 146.905C470.844 146.091 483.969 143.79 495.606 141.804C507.235 139.818 520.36 137.543 524.77 136.755C532.19 135.434 549.366 132.669 570.708 129.37C612.725 122.878 643.595 117.986 653.106 116.298C660.973 114.898 680.266 111.879 700.496 108.869C706.114 108.038 714.313 106.751 718.731 106.025C728.978 104.319 742.671 102.376 764.669 99.4977C774.294 98.2377 786.43 96.6102 791.645 95.8927C811.009 93.1977 824.957 91.4302 843.419 89.3127C853.84 88.1139 868.278 86.4514 875.496 85.6202C882.715 84.7977 893.872 83.4764 900.294 82.7064C906.708 81.9277 922.458 80.3002 935.294 79.0839C948.122 77.8764 965.184 76.2489 973.208 75.4702C1014.32 71.4889 1036.78 69.6777 1100.08 65.2327C1347.62 47.8727 1567.67 48.2927 1850.4 66.6852C1879.92 68.6102 1956.45 74.6914 1969.98 76.1877C1973.59 76.5902 1987.04 77.8939 1999.87 79.0927C2035.16 82.3827 2056.4 84.6577 2088.11 88.5252C2130.14 93.6614 2151.13 96.2864 2158.83 97.3627C2163.65 98.0364 2173.16 99.3139 2179.98 100.189C2186.8 101.073 2195.99 102.385 2200.4 103.111C2204.81 103.838 2213.01 105.159 2218.62 106.043C2224.24 106.926 2240.65 109.63 2255.08 112.054C2269.52 114.469 2285.27 117.05 2290.08 117.776C2294.9 118.511 2307.36 120.725 2317.79 122.703C2389.3 136.274 2453.26 151 2502.27 165.175C2512.3 168.071 2522.47 170.994 2524.87 171.659C2551.27 178.93 2602.95 196.684 2634.25 209.231C2721.98 244.389 2789.03 287.115 2815.46 324.688C2819.18 329.973 2826.32 338.705 2831.32 344.078C2900.3 418.181 2883.2 510.748 2783.73 601.669C2744.35 637.675 2717.45 655.595 2634.98 700.789C2582.97 729.288 2576.5 733.601 2595.89 726.873C2740.05 676.823 2902.5 569.705 2952.14 491.961C3021.97 382.595 2966.78 273.736 2797.58 187.076C2787.96 182.141 2775.81 176.244 2770.61 173.96C2765.39 171.676 2757.84 168.343 2753.83 166.549C2684.03 135.346 2596.67 107.101 2501.18 84.8677C2496.16 83.6952 2487.68 81.7002 2482.32 80.4227C2466.06 76.5464 2392.83 62.1527 2375.4 59.4052C2370.99 58.7139 2361.61 57.1127 2354.58 55.8439C2340.41 53.2977 2279.84 43.9702 2263.83 41.8614C2258.22 41.1264 2243.45 39.1752 2231.02 37.5214C2164.38 28.6839 2099.29 22.1477 1999.15 14.2377C1977.64 12.5402 1918.69 9.15393 1871.54 6.91393C1853.09 6.03893 1828.49 4.67392 1816.86 3.89517C1759.41 0.0276672 1653.33 -1.10108 1558.73 1.14767ZM326.434 387.478C207.819 425.846 84.024 502.365 43.6515 562.276C-15.3148 649.759 54.589 738.493 233.106 802.77C327.711 836.825 399.925 853.161 563.419 877.478C574.645 879.149 587.77 881.135 592.583 881.896C597.395 882.649 608.875 884.276 618.106 885.501C627.329 886.726 642.746 888.774 652.371 890.051C680.188 893.744 733.125 899.379 766.856 902.223C776.884 903.071 792.958 904.436 802.583 905.259C897.774 913.423 1256.08 909.756 1377.17 899.388C1385.99 898.626 1405.68 897.008 1420.92 895.783C1498.84 889.509 1566.79 883.778 1584.98 881.94C1592.59 881.17 1605.72 879.849 1614.15 879.009C1622.57 878.169 1635.03 876.848 1641.86 876.086C1648.67 875.316 1663.77 873.68 1675.4 872.446C1687.02 871.221 1700.81 869.594 1706.02 868.841C1711.24 868.08 1723.7 866.4 1733.73 865.105C1781.4 858.945 1809.49 854.316 1866.43 843.23C1876.46 841.279 1887.62 839.039 1891.23 838.251C1894.84 837.473 1905.99 835.163 1916.02 833.124C2090.51 797.643 2247.74 755.503 2332.26 721.588C2356.57 711.823 2355.91 709.933 2330.94 717.799C2311.4 723.959 2296.07 728.649 2289.72 730.39C2283.64 732.07 2279.07 733.348 2259.46 738.843C2250.64 741.319 2239.81 744.32 2235.4 745.519C2230.99 746.718 2222.78 748.975 2217.17 750.55C2205.19 753.893 2117.14 775.531 2101.23 779.04C2087.7 782.015 2081.27 783.459 2069.15 786.259C2054.7 789.584 2000.76 800.294 1976.54 804.634C1972.53 805.351 1963.67 806.97 1956.86 808.221C1950.03 809.481 1940.19 811.17 1934.98 811.984C1929.77 812.806 1921.89 814.058 1917.48 814.766C1900.1 817.575 1878.33 820.865 1868.62 822.143C1863.01 822.878 1853.17 824.19 1846.75 825.048C1830.42 827.235 1800 830.709 1781.86 832.45C1760.94 834.463 1746.52 835.906 1703.11 840.308C1682.65 842.381 1659.36 844.709 1651.33 845.488C1643.31 846.258 1630.18 847.561 1622.17 848.375C1614.15 849.189 1596.75 850.886 1583.52 852.146C1570.28 853.398 1553.55 855.016 1546.33 855.725C1479.13 862.34 1255.86 869.594 1162.06 868.203C935.171 864.843 774.241 853.293 661.121 832.249C657.114 831.505 647.594 830.228 639.981 829.414C626.603 827.979 615.394 826.456 596.958 823.56C592.145 822.808 581.645 821.163 573.621 819.911C557.408 817.374 552.551 816.473 526.231 811.056C493.051 804.231 472.375 799.331 440.919 790.818C426.753 786.985 386.336 774.306 375.294 770.229C369.676 768.155 359.176 764.288 351.958 761.645C274.258 733.146 186.81 679.185 160.516 643.503C102.206 564.385 159.248 476.631 323.52 392.745C341.869 383.365 342.464 382.289 326.434 387.478ZM497.059 1087.32C497.059 1130.19 497.111 1130.93 500.375 1135.77C505.704 1143.67 512.328 1147.33 521.34 1147.33H529.145V1138.58V1129.83H523.606C514.428 1129.83 514.559 1130.49 514.559 1085.05V1043.78H505.809H497.059V1087.32ZM717.27 1085.05C717.27 1134.38 719.641 1129.83 693.934 1129.83C669.548 1129.83 670.606 1130.69 670.606 1110.63C670.606 1091.41 669.994 1091.9 693.111 1091.9H709.981V1083.15V1074.4H691.327C659.083 1074.4 654.086 1078.94 653.351 1108.81C652.511 1143.39 656.694 1147.33 694.284 1147.33C734.201 1147.33 733.895 1147.77 734.464 1088.16L734.893 1043.78H726.082H717.27V1085.05ZM1364.77 1086.94C1364.77 1141.6 1367.05 1147.33 1388.81 1147.33H1396.86V1138.58V1129.83H1391.31C1382.14 1129.83 1382.27 1130.49 1382.27 1085.05V1043.78H1373.52H1364.77V1086.94ZM2004.98 1085.76C2004.98 1140.06 2007.19 1145.66 2029.05 1147.06L2038.52 1147.66V1138.74V1129.83H2032.01C2022.51 1129.83 2022.48 1129.7 2022.48 1083.99V1043.78H2013.73H2004.98V1085.76ZM24.0777 1050.59C23.544 1051.12 23.1065 1073.11 23.1065 1099.44V1147.33H31.8565H40.6065V1099.37V1051.42L37.3252 1050.54C32.9152 1049.35 25.2765 1049.39 24.0777 1050.59ZM80.7077 1070.03C60.8715 1089.9 60.1627 1090.45 54.1165 1090.45H47.8952V1099.2V1107.95H54.1165C60.154 1107.95 60.889 1108.51 79.9815 1127.64L99.6252 1147.33L112.041 1147.29L124.458 1147.27L99.669 1123.22L74.8715 1099.18L99.3015 1075.49C127.73 1047.92 126.873 1049.62 112.409 1049.62H101.086L80.7077 1070.03ZM1067.66 1051.04C1038.49 1055.49 1028.83 1071.45 1028.16 1116.34L1027.69 1147.33H1036.54H1045.4V1135.65V1123.99H1076.75H1108.11V1135.65V1147.33H1116.86H1125.61V1102.27C1125.61 1045.37 1128.31 1050.43 1097.66 1050.12C1085.36 1049.98 1071.86 1050.4 1067.66 1051.04ZM1802.27 1050.96C1782.6 1054.99 1773.14 1074.64 1782.03 1093C1788.11 1105.57 1792.56 1107.1 1825.27 1107.95C1857.7 1108.78 1860.41 1109.84 1858.59 1121.03C1857.19 1129.69 1856.53 1129.83 1815.84 1129.83H1778.93V1138.64V1147.46L1818.79 1147.03L1858.64 1146.59L1864.5 1142.72C1878.63 1133.35 1880.43 1111.4 1868.09 1099.05C1860.73 1091.69 1854.88 1090.47 1826.97 1090.46C1799.51 1090.45 1796.43 1089.36 1796.43 1079.62C1796.43 1068.38 1797.92 1067.9 1835.02 1067.36L1868.04 1066.87L1867.6 1058.61L1867.17 1050.34L1837.27 1050.13C1820.83 1050.02 1805.08 1050.4 1802.27 1050.96ZM2325.81 1098.4V1147.33H2334.56H2343.31V1127.64V1107.95H2374.67H2406.02V1127.64V1147.33H2414.77H2423.52V1098.47V1049.62H2414.77H2406.02V1070.03V1090.45H2374.7H2343.4L2342.99 1070.4L2342.58 1050.34L2334.2 1049.91L2325.81 1049.47V1098.4ZM1107.78 1087.17L1108.19 1106.49H1076.6H1045L1045.74 1096.2C1047.27 1074.86 1059.78 1067.13 1092.06 1067.62L1107.37 1067.84L1107.78 1087.17ZM148.888 1076.58C145.641 1078.92 145.606 1079.36 145.606 1113.13V1147.33H154.356H163.106V1119.5V1091.68L182.033 1092.16C209.053 1092.84 208.869 1092.63 209.534 1124.02L210.024 1147.33H218.573H227.113L226.745 1122.9C226.281 1092.38 223.578 1085.44 209.07 1077.58C202.438 1073.99 153.613 1073.18 148.888 1076.58ZM268.833 1075.46C256.163 1078.54 252.059 1087.28 252.059 1111.18C252.059 1144.05 255.716 1147.27 293.044 1147.3C328.998 1147.34 334.248 1142.5 333.434 1110.14C332.655 1078.96 327.361 1074.3 293.026 1074.58C281.328 1074.67 270.434 1075.06 268.833 1075.46ZM359.981 1109.12C359.981 1146.8 360.086 1147.33 368.031 1147.33C372.065 1147.33 374.708 1144.94 390.711 1126.9L408.833 1106.46L409.559 1125.49C410.364 1146.51 410.723 1147.27 419.849 1147.3C433.429 1147.36 453.589 1125.64 472.76 1090.3C481.484 1074.21 481.519 1074.4 470.214 1074.4H460.86L453.283 1088.62C446.029 1102.24 433.823 1120.19 429.238 1124C427.321 1125.58 427.059 1123.04 427.059 1103.03C427.059 1082.18 426.814 1080 424.145 1077.33C417.976 1071.16 415.588 1072.7 394.981 1096.15C385.75 1106.64 377.718 1115.23 377.114 1115.23C376.51 1115.24 376.02 1106.05 376.02 1094.83V1074.4H367.996H359.981V1109.12ZM564.871 1076.57C552.814 1082.24 551.02 1086.82 551.029 1111.89C551.038 1143.74 554.599 1147.31 586.388 1147.32L606.434 1147.33V1139.3V1131.28H589.573C566.341 1131.28 567.059 1131.91 567.059 1111.77C567.059 1090.14 566.735 1090.45 589.345 1090.45C611.955 1090.45 618.824 1094.15 612.918 1103.18C610.853 1106.33 609.864 1106.49 592.548 1106.49H574.356V1114.52V1122.53H594.551C613.101 1122.53 615.149 1122.27 619.576 1119.25C635.738 1108.25 634.591 1084.94 617.52 1077.19C609.785 1073.67 571.985 1073.23 564.871 1076.57ZM776.543 1075.91C764.809 1079.42 761.02 1088.17 761.02 1111.71C761.02 1142.69 765.85 1147.33 798.111 1147.33H818.044L817.606 1138.94L817.169 1130.55L798.995 1130.14C777.383 1129.65 778.573 1130.79 778.546 1110.55C778.511 1091.33 777.768 1091.9 802.381 1091.9C826.96 1091.9 825.184 1089.13 825.184 1127.56C825.184 1164.52 826.925 1161.68 803.948 1162.22L786.544 1162.64L786.106 1171.02L785.669 1179.4H805.496C840.505 1179.4 842.684 1176.29 842.684 1126.27C842.684 1077.52 840.155 1074.31 801.909 1074.54C790.245 1074.61 778.835 1075.22 776.543 1075.91ZM881 1077.39C870.037 1082.95 868.208 1087.84 868.208 1111.71C868.208 1143.28 872.338 1147.33 904.59 1147.33H924.357V1139.3V1131.28H907.486C884.238 1131.28 884.982 1131.93 884.982 1111.63C884.982 1090.27 884.78 1090.45 908.309 1090.45C927.524 1090.45 931.645 1092 931.645 1099.23C931.645 1105.4 928.241 1106.49 909.14 1106.49H892.27V1114.52V1122.53H912.028C926.736 1122.53 932.87 1121.97 936.02 1120.35C951.744 1112.21 952.829 1087.85 937.875 1078.56C929.633 1073.43 890.415 1072.63 881 1077.39ZM1157.8 1077.21C1154.91 1080.1 1154.77 1081.76 1154.77 1113.78V1147.33H1163.52H1172.27V1119.62V1091.9H1190.65H1209.02L1213.98 1096.87L1218.93 1101.83V1124.58V1147.33H1227.81H1236.68L1236.19 1122.17C1235.62 1092.4 1233.85 1087.37 1221.24 1079.57L1214.07 1075.14L1187.45 1074.66C1162.1 1074.2 1160.69 1074.33 1157.8 1077.21ZM1275.81 1082.31V1090.45H1296.23C1322.74 1090.45 1322.48 1090.23 1322.48 1111.37C1322.48 1131.63 1322.91 1131.28 1297.97 1131.28C1279.05 1131.28 1278.77 1131.24 1276.37 1127.58C1270.34 1118.37 1277.81 1114.62 1300.45 1115.47L1313.73 1115.97V1107.47V1098.98L1293.55 1099.46C1266.58 1100.09 1258.27 1105.96 1258.34 1124.31C1258.41 1142.37 1266.89 1147.16 1298.97 1147.26C1334.65 1147.36 1338.52 1143.75 1338.52 1110.33C1338.52 1078.84 1334.74 1075.37 1299.63 1074.65L1275.81 1074.16V1082.31ZM1418.73 1101.65C1418.73 1143.83 1421.57 1147.33 1455.75 1147.33H1475.61V1138.58V1129.83H1457.67C1434.67 1129.83 1436.23 1131.98 1436.23 1100.37V1074.4H1427.48H1418.73V1101.65ZM1482.9 1116.41C1482.9 1166.33 1484.98 1161.9 1461.46 1161.9H1443.52V1170.65V1179.4H1463.37C1499.7 1179.4 1500.4 1178.25 1500.4 1117.7V1074.4H1491.65H1482.9V1116.41ZM1525.18 1083.15V1091.9H1546.63H1568.09L1546.63 1113.53C1514.14 1146.29 1514.69 1147.33 1564.54 1147.33H1598.25L1597.81 1138.94L1597.37 1130.55L1576.57 1129.83L1555.77 1129.09L1576.93 1107.97C1609.08 1075.89 1608.28 1074.4 1558.98 1074.4H1525.18V1083.15ZM1635.29 1076.47C1624.04 1081.47 1621.43 1088.27 1621.43 1112.62C1621.43 1143.29 1625.56 1147.33 1656.98 1147.33H1676.86V1139.3V1131.28H1659.46C1637.09 1131.28 1637.48 1131.64 1637.48 1111.49C1637.48 1090.51 1637.54 1090.45 1661.26 1090.45C1681.02 1090.45 1684.51 1091.62 1684.51 1098.21C1684.51 1105.67 1682.43 1106.49 1663.55 1106.49H1646.23V1114.52V1122.53H1665.7C1683.49 1122.53 1685.59 1122.25 1689.99 1119.25C1706.16 1108.25 1705.36 1086.31 1688.49 1077.69C1680.72 1073.71 1643.41 1072.86 1635.29 1076.47ZM1912.23 1077.19C1901.29 1082.16 1899.33 1086.8 1898.77 1109.08C1897.93 1143.35 1902.18 1147.33 1939.7 1147.33C1975.37 1147.33 1979.19 1144.1 1979.91 1113.32C1980.46 1089.81 1978.1 1083.22 1967.12 1077.69C1958.14 1073.16 1921.82 1072.83 1912.23 1077.19ZM2060.4 1107.83C2060.4 1150.64 2060.19 1150.22 2079.11 1147.3C2106.97 1143.02 2129.81 1121.39 2144.01 1085.82C2146.15 1080.48 2147.9 1075.72 2147.9 1075.25C2147.9 1074.79 2143.79 1074.41 2138.78 1074.43L2129.67 1074.45L2126.17 1083.54C2116.88 1107.73 2095.54 1129.65 2081.18 1129.79L2077.9 1129.83V1102.12V1074.4H2069.15H2060.4V1107.83ZM2180.71 1075.39C2168.22 1078.69 2163.93 1087.94 2163.93 1111.62C2163.93 1142.83 2168.61 1147.33 2201.07 1147.33H2220.81V1139.3V1131.28H2202.66C2179.92 1131.28 2179.98 1131.33 2179.98 1110.54C2179.98 1090.65 2180.22 1090.45 2203.72 1090.45C2223.27 1090.45 2228.11 1092.01 2228.11 1098.33C2228.11 1105.08 2224.24 1106.49 2205.75 1106.49H2188.73V1114.52V1122.53H2208.52C2220.63 1122.53 2229.53 1121.88 2231.48 1120.85C2247.67 1112.31 2248.74 1089.51 2233.47 1078.19C2229.38 1075.16 2189.59 1073.05 2180.71 1075.39ZM2465.81 1082.43V1090.45H2485.59C2512.17 1090.45 2511.02 1089.54 2511.02 1110.63C2511.02 1132.32 2512.16 1131.28 2488.23 1131.28C2466.99 1131.28 2463.78 1130.12 2464.64 1122.75C2465.32 1116.95 2470.44 1115.18 2486.23 1115.31C2493.84 1115.37 2500.91 1115.38 2501.9 1115.33C2503.13 1115.27 2503.73 1112.62 2503.73 1107.22V1099.2H2485.23C2457.37 1099.2 2448.3 1105.34 2448.32 1124.19C2448.33 1143.01 2455.68 1147.31 2487.83 1147.32C2524.5 1147.33 2527.79 1144.34 2527.79 1111.12C2527.79 1078.11 2523.81 1074.49 2487.33 1074.44L2465.81 1074.4V1082.43ZM2570.05 1075.89C2555.83 1080.23 2553.33 1089 2553.32 1134.56L2553.31 1170.65H2562.06H2570.81V1133.69C2570.81 1088.24 2568.67 1091.9 2595.18 1091.9C2618.72 1091.9 2617.7 1090.96 2617.17 1112.54L2616.75 1129.09L2598.15 1129.5L2579.56 1129.92V1138.62V1147.33H2598.66C2631.2 1147.33 2634.25 1144.24 2634.25 1111.34C2634.25 1087.14 2633.67 1085.21 2624.21 1078.14C2619.72 1074.79 2579.19 1073.1 2570.05 1075.89ZM2674.38 1077.69C2661.92 1084.06 2662.02 1083.68 2661.53 1129.93L2661.1 1170.65H2669.91H2678.73V1132.79C2678.73 1087.89 2676.39 1091.9 2702.59 1091.9C2725.86 1091.9 2725.4 1091.51 2725.4 1111.41C2725.4 1130.43 2726.1 1129.83 2703.96 1129.83H2686.02V1138.58V1147.33H2706.22C2737.57 1147.33 2741.92 1143.27 2742.62 1113.32C2743.42 1079.79 2737.81 1074.4 2702.06 1074.4C2682.9 1074.4 2680.18 1074.73 2674.38 1077.69ZM2767.94 1102.48C2768.65 1144.2 2771.18 1147.33 2804.36 1147.33H2824.56V1138.58V1129.83H2806.39C2783.82 1129.83 2785.18 1131.8 2785.18 1099.3V1074.4H2776.33H2767.47L2767.94 1102.48ZM2831.51 1117.8L2831.12 1161.18L2812.53 1161.59L2793.93 1161.99V1170.7V1179.4L2813.26 1179.39C2848.88 1179.34 2849.36 1178.54 2849.36 1118.55V1074.4H2840.62H2831.9L2831.51 1117.8ZM313.939 1094.2C316.879 1097.15 317.246 1123.5 314.394 1127.4C312.784 1129.61 310.019 1129.86 291.425 1129.5L270.294 1129.09L269.874 1112.54C269.603 1101.57 270.031 1095.28 271.151 1093.94C273.75 1090.81 310.771 1091.04 313.939 1094.2ZM1960.39 1094.2C1963.3 1097.09 1963.74 1125.27 1960.93 1128.08C1959.74 1129.27 1952.83 1129.83 1939.36 1129.83C1925.87 1129.83 1918.96 1129.27 1917.77 1128.08C1915.37 1125.67 1915.37 1096.06 1917.77 1093.66C1920.63 1090.8 1957.46 1091.27 1960.39 1094.2Z" fill="#F57407"/>
                <path class="logo__blue-text" fill-rule="evenodd" clip-rule="evenodd" d="M568.879 434.562L569.247 627.43H604.247H639.247L639.623 434.562L639.99 241.703H604.247H568.512L568.879 434.562ZM794.454 320.453L715.835 399.203H691.012H666.179L666.564 434.562L666.958 469.93L691.79 470.323L716.614 470.726L795.32 549.441L874.035 628.156H923.254C950.633 628.156 972.482 627.587 972.482 626.878C972.482 626.17 950.327 604.041 923.263 577.703C845.449 501.998 823.137 480.22 798.952 456.393L776.333 434.098L796.02 414.945C806.844 404.41 828.5 383.322 844.145 368.088C859.782 352.855 882.094 331.146 893.732 319.858C905.361 308.562 928.067 286.355 944.184 270.508L973.497 241.703H923.281H873.073L794.454 320.453ZM1188.31 242.762C1117.2 251.048 1055.76 301.737 1034.06 370.031C1025.12 398.127 1024.98 400.551 1024.98 519.77V628.156H1059.98H1094.98V580.766V533.367H1217.46H1339.94L1340.32 580.398L1340.71 627.43H1375.71H1410.71V447.328V267.218L1407.43 261.085C1403.31 253.367 1397.77 248.012 1390.29 244.503C1384.78 241.913 1208.59 240.4 1188.31 242.762ZM1574.77 245.133C1534.85 255.73 1506.53 282.531 1495.69 319.946C1481.93 367.441 1499.88 423.703 1536.78 448.72C1567.04 469.247 1576.84 470.656 1689.21 470.665C1780.16 470.673 1780.79 470.726 1790.93 478.426C1810.27 493.108 1811.99 530.716 1794.05 546.475C1782.5 556.625 1793.53 555.925 1636.36 556.371L1494.51 556.773L1494.9 592.097L1495.29 627.43H1638.21H1781.12L1793.52 623.938C1848.75 608.363 1877.77 569.347 1877.17 511.492C1876.66 463.393 1855.69 429.977 1813.57 410.106C1791.6 399.746 1795.82 400.113 1689.25 399.256L1593 398.468L1585.71 395.108C1553.79 380.408 1554.13 330.087 1586.25 314.923C1591.1 312.64 1602.12 312.395 1717.33 312.018L1843.11 311.607V276.651V241.703L1715.14 241.773L1587.17 241.843L1574.77 245.133ZM1951.02 434.93V628.156H1986.02H2021.02V549.406V470.656H2143.51H2265.99L2266.37 549.047L2266.75 627.43H2301.75H2336.75L2337.12 434.562L2337.49 241.703H2301.76H2266.05L2265.67 320.086L2265.29 398.468H2143.52H2021.75L2021.37 320.086L2020.99 241.703H1986.01H1951.02V434.93ZM1339.98 386.805V461.906H1217.28H1094.58L1095.42 436.75C1097.76 366.417 1130.44 325.721 1193.42 314.696C1207.45 312.237 1209.29 312.176 1276.18 311.931L1339.98 311.703V386.805Z" fill="#047CA3"/>
            </svg>
        </a>
    </div>


<button id="nav-hamburger-button" class="nav-display-button" onclick="toggleNavigation()">
    <div class="hamburber-bar hamburber-1"></div>
    <div class="hamburber-bar hamburber-2"></div>
    <div class="hamburber-bar hamburber-3"></div>
</button>
<div id="nav-and-contact-holder" class="nav-and-contact-holder">
    <nav class="main-nav">
        <ul class="header__nav-list">


            <li class="nav-list__list-item">
                <details class="main-nav__list-item">
                    <summary class="main-nav__list-item__title">
                        <p class="nav-top-level__no-link--mobile">
                            Home
                        </p>
                        <a class="nav-top-level__link--desktop" href="/">
                            Home
                        </a>
                    </summary>
                     
                    <div class="nav-dropdown-content-holder dropdown-home-holder">

                        <div class="nav-item__sub-links home-nav__sub-links">
                            <div class="dropdown-media-content home-menu__media-content">
                                <img height="266" width="177" src="./assets/data-g49dc32716_1920.webp" alt="computer screen containing charts">
                                <div class="home-media__text-content">
                                    <p class="dropdown-media--home__p-1">
                                        Find your path in 
                                    </p>
                                    <p class="dropdown-media--home__p-2">
                                        The <br>Data <br>Revolution 
                                    </p>
                                    <p class="dropdown-media--home__p-3">
                                        with <span>KASH Tech</span> 
                                    </p>
                                </div>
                            </div>

                            <ul>                                            
                                <li>
                                    <a href="/#home-page__who-we-are">
                                        Who We Are
                                    </a>
                                </li>
                                <li>
                                    <a href="/#home-page__services">
                                        Services
                                    </a>
                                </li>
                                <li>
                                    <a href="/#home-page__partner-program">
                                        Industry Partnerships
                                    </a>
                                </li>
                                <li>
                                    <a href="/#home-page__leadership-team">
                                        Leadership Team
                                    </a>
                                </li>
                                <li>
                                    <a href="/#home-page__customer-success">
                                        Customer Success
                                    </a>
                                </li>
                                <li>
                                    <a href="/#home-page__contact-form">
                                        Contact Us
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </details>
            </li>



            <li class="nav-list__list-item">
                <details class="main-nav__list-item">
                    <summary class="main-nav__list-item__title">
                        <p class="nav-top-level__no-link--mobile">
                            Services                                            
                        </p>
                        <a class="nav-top-level__link--desktop" href="#">
                            Services
                        </a>
                    </summary>

                    


                    <div class="nav-item__sub-links services-nav__sub-links">
                        <div class="dropdown-media-content services-menu__media-content">
                            <div class="services-nav-media-holder">
                            <img height="216" width="310" src="./assets/services-dropdown__media-img.webp" alt="triptych of screen with graph data" class="services-dropdown__media-img">                               
                            </div>
                        </div>

                        <ul>                                            
                            <li>
                                <a href="/consulting-services.html">
                                    Consulting Services
                                </a>
                            </li>
                            <li>
                                <a href="/analytics-services.html">
                                    Analytics Services
                                </a>
                            </li>
                            <li>
                                <a href="/data-services.html">
                                    Data Services
                                </a>
                            </li>                                                                                    
                            <li>
                                <a href="/application-development-services.html">
                                    Application Development Services
                                </a>
                            </li>
                        </ul>
                    </div>
                </details>
            </li>

            

            <li class="nav-list__list-item">
                <details class="main-nav__list-item">
                    <summary class="main-nav__list-item__title">                                        
                        <p class="nav-top-level__no-link--mobile">
                            Company
                        </p>
                        <a class="nav-top-level__link--desktop" href="#">
                            Company
                        </a>
                    </summary>
                    <div class="nav-item__sub-links company-nav__sub-links">

                        <div class="dropdown-media-content company-menu__media-content">
                            <img height="139" width="309" src="./assets/company-dropdown-img.png" alt="triangular image cutouts featuring people, an SVG diagram(Process), and a stock image of graphs ,charts, and data (Technology)">
                            <div class="home-media__text-content">
                                <p class="nav-dropdown--company__media-text">
                                    <span class="media-text__large-letter">
                                        <span class="people">People, <br></span>
                                        <span class="process">Process, <br></span>
                                        <span class="ampersand-span">&#38;</span>
                                        <span class="technology">Technology<br></span>
                                    </span>
                                    <p class="media-text__byline">
                                        transform your relationship with data
                                    </p>
                                </p>
                            </div>
                        </div>

                        <ul>      
                            <li>
                                <a href="/company_about-us.html">
                                    About Us
                                </a>                            
                            </li>
                            <li>
                                <a href="/company-solutions.html">
                                    Solutions
                                </a>
                            </li>                                      
                            <li>
                                <a href="/careers-page.html">
                                    Careers
                                </a>
                            </li>                                      
                            <li>
                                Case Studies (Coming Soon)
                            </li>
                            <li>
                                Company News (Coming Soon)
                            </li>
                            
                        </ul>
                    </div>
                </details>
            </li>




            <li class="nav-list__list-item">
                <details class="main-nav__list-item">
                    <summary class="main-nav__list-item__title">                                        
                        <p class="nav-top-level__no-link--mobile">
                            Resources
                        </p>
                        <a class="nav-top-level__link--desktop" href="#">
                            Resources
                        </a>
                    </summary>
                    <div class="nav-item__sub-links resources-nav__sub-links">

                        <div class="dropdown-media-content resources-menu__media-content">
                            <img width="154" height="216" src="./assets/resources-dropdown-1.webp" alt="Portion of a library's bookshelves" class="resources-nav-dropdown__media-img">
                            <img width="154" height="216" src="./assets/resources-dropdown-2.webp" alt="Computer and coffee in a coffee house" class="resources-nav-dropdown__media-img">
                        </div>
                        <ul>                                            
                            <li>
                                <a href="/resources-articles.html">
                                Articles / White Papers
                                </a>
                            </li>
                            <li>
                                Blogs (Coming Soon)
                            </li>
                            <li>
                                User Stories (Coming Soon)
                            </li>
                        </ul>
                    </div>
                </details>
            </li>




            <li class="nav-list__list-item">
                <details class="main-nav__list-item">
                    <summary class="main-nav__list-item__title">                                        
                        <p class="nav-top-level__no-link--mobile">
                            Technology
                        </p>
                        <a class="nav-top-level__link--desktop" href="/technology.html">
                            Technology
                        </a>
                    </summary>
                    <div class="nav-dropdown-content-holder dropdown-technology-holder"> 
                        <div class="nav-item__sub-links technology-nav__sub-links">
                            <img width="428" height="231" class="dropdown-media-content" src="./assets/svg-assets/data-services__word-cloud.svg" alt="word cloud containing phrases and words pertaining to data and analysis" />
                            <ul>        
                                <li>
                                    <a href="/technology.html#languages-and-frameworks">
                                        Languages and Frameworks
                                    </a>
                                </li>
                                <li>
                                    <a href="/technology.html#technologies__databases">
                                        Databases
                                    </a>
                                </li>
                                <li>
                                    <a href="/technology.html#technologies__cloud-platforms">
                                        Cloud Platforms
                                    </a>
                                </li>
                                <li>
                                    <a href="/technology.html#technologies__bi-technologies">
                                        BI Technologies
                                    </a>
                                </li>
                                <li>
                                    <a href="/technology.html#technologies__data-management">
                                        Data Management
                                    </a>
                                </li>
                                <li>
                                    <a href="/technology.html#technology__tech-platforms">
                                        Technology Platforms
                                    </a>
                                </li>
                                <li>
                                    <a href="/technology.html#technology__other">
                                        Other Technologies
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
</details>
            </li>


            <li class="nav-list__list-item nav-list__contact-item">
                <a href="/#home-page__contact-form" class="button-link nav-list__contact-link">
                Contact Us
                </a> 
            </li>
        </ul>
    </nav>
</div>

</div>`;

headerHolder.append(headerContent);
