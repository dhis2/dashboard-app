## [31.19.1](https://github.com/dhis2/dashboard-app/compare/v31.19.0...v31.19.1) (2021-09-03)


### Bug Fixes

* bump cli-app-scripts to solve issues with z-index and Modals ([#1931](https://github.com/dhis2/dashboard-app/issues/1931)) ([d49347d](https://github.com/dhis2/dashboard-app/commit/d49347df502b8d88ea7c27fa8501737703c8ae76))
* disable dirty check on exit (DHIS2-11701) ([#1930](https://github.com/dhis2/dashboard-app/issues/1930)) ([f452540](https://github.com/dhis2/dashboard-app/commit/f4525400ba8ee2195f59a52f64a2078178f75305))
* readd missing offlinejs file ([#1929](https://github.com/dhis2/dashboard-app/issues/1929)) ([86851b1](https://github.com/dhis2/dashboard-app/commit/86851b1ecca208534d4524416050a12e7ba8ecc2))
* reduce cypress runners from 10 to 3 for fewer db conflicts ([#1937](https://github.com/dhis2/dashboard-app/issues/1937)) ([9c6a2e3](https://github.com/dhis2/dashboard-app/commit/9c6a2e3e640f7d876162d554a34701d093bec350))
* reenable cypress tests for offline ([#1928](https://github.com/dhis2/dashboard-app/issues/1928)) ([cbb782c](https://github.com/dhis2/dashboard-app/commit/cbb782cb3ee04a11d7c47125168b1b725ebba802))
* upgrade d2-ui 7.3.3 ([#1932](https://github.com/dhis2/dashboard-app/issues/1932)) ([09d446d](https://github.com/dhis2/dashboard-app/commit/09d446d5a195cde0f2067ee52811b833007c709e))

# [31.19.0](https://github.com/dhis2/dashboard-app/compare/v31.18.0...v31.19.0) (2021-09-01)


### Bug Fixes

* bump analytics and ui to latest ([#1927](https://github.com/dhis2/dashboard-app/issues/1927)) ([20e9187](https://github.com/dhis2/dashboard-app/commit/20e9187852d6aab98592e63831118544630f6382))


### Features

* use the new SharingDialog with cascading sharing ([#1913](https://github.com/dhis2/dashboard-app/issues/1913)) ([0d37a41](https://github.com/dhis2/dashboard-app/commit/0d37a41784b8eb7d96a5b371809c3c65c059625f))

# [31.18.0](https://github.com/dhis2/dashboard-app/compare/v31.17.9...v31.18.0) (2021-09-01)


### Bug Fixes

* disable or delete cypress tests that are currently broken [v37] ([#1925](https://github.com/dhis2/dashboard-app/issues/1925)) ([#1926](https://github.com/dhis2/dashboard-app/issues/1926)) ([264a999](https://github.com/dhis2/dashboard-app/commit/264a9996f90d4254b6f899840669158d3b7e154b))
* migrate from chart/pt to visualizations ([#1916](https://github.com/dhis2/dashboard-app/issues/1916)) ([b313a39](https://github.com/dhis2/dashboard-app/commit/b313a39b08b2fb80e0d436761d47e470b9f7b0d3))


### Features

* dashboard layout (DHIS2-3600) ([#1803](https://github.com/dhis2/dashboard-app/issues/1803)) ([75da018](https://github.com/dhis2/dashboard-app/commit/75da0186cb5c9ab98c6ea5498cba48e89c1c121e))
* offline dashboard ([#1700](https://github.com/dhis2/dashboard-app/issues/1700)) ([4103643](https://github.com/dhis2/dashboard-app/commit/4103643ff74c38b561d09b656063153fb68d2894))

## [31.17.9](https://github.com/dhis2/dashboard-app/compare/v31.17.8...v31.17.9) (2021-08-26)


### Bug Fixes

* legend key print style (DHIS2-11636) ([#1911](https://github.com/dhis2/dashboard-app/issues/1911)) ([bf3c61b](https://github.com/dhis2/dashboard-app/commit/bf3c61b3969711cc2bf078c6cea2d1ab350f334b))

## [31.17.8](https://github.com/dhis2/dashboard-app/compare/v31.17.7...v31.17.8) (2021-08-25)


### Bug Fixes

* pass callback to handle expanded flag everywhere DashboardsBar is used [DHIS2-11031] ([#1914](https://github.com/dhis2/dashboard-app/issues/1914)) ([23de3c1](https://github.com/dhis2/dashboard-app/commit/23de3c16f6403b9a5f969155883977a1271f1f29)), closes [#1764](https://github.com/dhis2/dashboard-app/issues/1764)

## [31.17.7](https://github.com/dhis2/dashboard-app/compare/v31.17.6...v31.17.7) (2021-08-25)


### Bug Fixes

* adjust z-index so tooltip on Show more/fewer dashboards button shows ([#1912](https://github.com/dhis2/dashboard-app/issues/1912)) ([cce97f9](https://github.com/dhis2/dashboard-app/commit/cce97f963c764d6a2cbc26d29fb85b1015fb12e5))

## [31.17.6](https://github.com/dhis2/dashboard-app/compare/v31.17.5...v31.17.6) (2021-08-23)


### Bug Fixes

* replace icons used for list item delete items ([#1909](https://github.com/dhis2/dashboard-app/issues/1909)) ([55ba86d](https://github.com/dhis2/dashboard-app/commit/55ba86d379315eea619ff3de5a9121242bb592c4))

## [31.17.5](https://github.com/dhis2/dashboard-app/compare/v31.17.4...v31.17.5) (2021-08-23)


### Bug Fixes

* response code for /userDataStore has been restored to 201 ([#1910](https://github.com/dhis2/dashboard-app/issues/1910)) ([00ea30f](https://github.com/dhis2/dashboard-app/commit/00ea30ff3143b2f5feb74afac449394b3c8ca243)), closes [#1896](https://github.com/dhis2/dashboard-app/issues/1896)

## [31.17.4](https://github.com/dhis2/dashboard-app/compare/v31.17.3...v31.17.4) (2021-08-18)


### Bug Fixes

* content css ([#1907](https://github.com/dhis2/dashboard-app/issues/1907)) ([d8c5dec](https://github.com/dhis2/dashboard-app/commit/d8c5deca56ac7ebde290c3980b3575d8f9ad86b1))

## [31.17.3](https://github.com/dhis2/dashboard-app/compare/v31.17.2...v31.17.3) (2021-08-13)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([#1852](https://github.com/dhis2/dashboard-app/issues/1852)) ([2c892d7](https://github.com/dhis2/dashboard-app/commit/2c892d7ce8924b229f7c4c7d840039e3886bbdba))

## [31.17.2](https://github.com/dhis2/dashboard-app/compare/v31.17.1...v31.17.2) (2021-08-13)


### Bug Fixes

* break up TitleBar into components ([#1901](https://github.com/dhis2/dashboard-app/issues/1901)) ([965b33d](https://github.com/dhis2/dashboard-app/commit/965b33d5d8335cfbfb8ac9d63690bc46a1cb148b))

## [31.17.1](https://github.com/dhis2/dashboard-app/compare/v31.17.0...v31.17.1) (2021-08-12)


### Bug Fixes

* bump dv plugin and ui to latest ([#1892](https://github.com/dhis2/dashboard-app/issues/1892)) ([89dd128](https://github.com/dhis2/dashboard-app/commit/89dd128c60acd1c88d7c1bc2eeb11cc331586179))
* set correct item height when adding dashboard items in edit mode ([#1868](https://github.com/dhis2/dashboard-app/issues/1868)) ([41575f4](https://github.com/dhis2/dashboard-app/commit/41575f4fc44c97e6f2c4249d668ba1cad04ca4ff)), closes [#1826](https://github.com/dhis2/dashboard-app/issues/1826)
* the response code for PUT userDataStore has been changed from 201 to 200 ([#1896](https://github.com/dhis2/dashboard-app/issues/1896)) ([ced4258](https://github.com/dhis2/dashboard-app/commit/ced4258298c5dee0c57861885ab47236c05e20d2))

# [31.17.0](https://github.com/dhis2/dashboard-app/compare/v31.16.4...v31.17.0) (2021-07-07)


### Features

* legend key (DHIS2-11239) ([#1839](https://github.com/dhis2/dashboard-app/issues/1839)) ([571c302](https://github.com/dhis2/dashboard-app/commit/571c3023c99e776003160642f3ccc0160d784a52))

## [31.16.4](https://github.com/dhis2/dashboard-app/compare/v31.16.3...v31.16.4) (2021-06-30)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([#1798](https://github.com/dhis2/dashboard-app/issues/1798)) ([3640928](https://github.com/dhis2/dashboard-app/commit/3640928fb6b3dbe81603e50100b65bb3ee4db756))
* fix locale format passed to Intl in interpretations ([#1835](https://github.com/dhis2/dashboard-app/issues/1835)) ([91304a4](https://github.com/dhis2/dashboard-app/commit/91304a47eb02d37cf456fdc499ff950152db36a5))

## [31.16.3](https://github.com/dhis2/dashboard-app/compare/v31.16.2...v31.16.3) (2021-06-22)


### Bug Fixes

* add onError callback to handle failed chart from DV plugin [DHIS2-11303] ([#1826](https://github.com/dhis2/dashboard-app/issues/1826)) ([2aa5f6b](https://github.com/dhis2/dashboard-app/commit/2aa5f6b483d9e2214aa172a0c760eaec208c34c7))

## [31.16.2](https://github.com/dhis2/dashboard-app/compare/v31.16.1...v31.16.2) (2021-06-22)


### Bug Fixes

* dashboards bar row height should only be changed after user drags to change the height ([#1830](https://github.com/dhis2/dashboard-app/issues/1830)) ([1e4503d](https://github.com/dhis2/dashboard-app/commit/1e4503d6074ca787e4890bf1fcc5fca7da48d7af))

## [31.16.1](https://github.com/dhis2/dashboard-app/compare/v31.16.0...v31.16.1) (2021-06-14)


### Bug Fixes

* dashboard crashes if an item is missing type [TECH-588] ([#1812](https://github.com/dhis2/dashboard-app/issues/1812)) ([a200395](https://github.com/dhis2/dashboard-app/commit/a2003954a7268992427cf647605cf9ce80bdefa1))
* include hideTitle property when loading map [DHIS2-11302] ([18d3053](https://github.com/dhis2/dashboard-app/commit/18d3053eb1152ba4e0d82d65e17661de33a2cf69))

# [31.16.0](https://github.com/dhis2/dashboard-app/compare/v31.15.6...v31.16.0) (2021-05-31)


### Bug Fixes

* applying a filter to a dashboard with a Map item results in the map not rendering [DHIS2-11054] ([#1741](https://github.com/dhis2/dashboard-app/issues/1741)) ([cd4d2d6](https://github.com/dhis2/dashboard-app/commit/cd4d2d64d4c444d43f206885cd68c509df476806))


### Features

* hide periods based on system settings (DHIS2-11161) ([#1789](https://github.com/dhis2/dashboard-app/issues/1789)) ([d01c2e6](https://github.com/dhis2/dashboard-app/commit/d01c2e6299641d1038d129716e311e03e96b4368))

## [31.15.6](https://github.com/dhis2/dashboard-app/compare/v31.15.5...v31.15.6) (2021-05-25)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([#1773](https://github.com/dhis2/dashboard-app/issues/1773)) ([fd7359f](https://github.com/dhis2/dashboard-app/commit/fd7359f3d7efc017ea0a333902f5faf17d410b2a))

## [31.15.5](https://github.com/dhis2/dashboard-app/compare/v31.15.4...v31.15.5) (2021-05-18)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([#1766](https://github.com/dhis2/dashboard-app/issues/1766)) ([e0b0062](https://github.com/dhis2/dashboard-app/commit/e0b0062e6a37a0aa630f080f415babc3333012bd))

## [31.15.4](https://github.com/dhis2/dashboard-app/compare/v31.15.3...v31.15.4) (2021-05-18)


### Bug Fixes

* all cypress tests in edit mode should check that view mode is displayed first ([#1769](https://github.com/dhis2/dashboard-app/issues/1769)) ([0be9fb1](https://github.com/dhis2/dashboard-app/commit/0be9fb1f39271909c0a042378c2d31e89eb5d3dd))

## [31.15.3](https://github.com/dhis2/dashboard-app/compare/v31.15.2...v31.15.3) (2021-05-11)


### Bug Fixes

* dashboards bar does not resize to 1 row [DHIS2-11097] ([#1761](https://github.com/dhis2/dashboard-app/issues/1761)) ([c73bf3a](https://github.com/dhis2/dashboard-app/commit/c73bf3a5f7e8b0d09bb6c7ed570e8ea489c71169))
* save starred dashboard should not remove the star [DHIS2-11089] ([#1757](https://github.com/dhis2/dashboard-app/issues/1757)) ([f030dae](https://github.com/dhis2/dashboard-app/commit/f030dae1df85b93c78bfe14bdc929aca8dc18704))

## [31.15.2](https://github.com/dhis2/dashboard-app/compare/v31.15.1...v31.15.2) (2021-05-10)


### Bug Fixes

* set showDescription to false before running tests that change this setting ([#1746](https://github.com/dhis2/dashboard-app/issues/1746)) ([98f5d7c](https://github.com/dhis2/dashboard-app/commit/98f5d7c03156627176dde5ae66e06a0196310b1e))

## [31.15.1](https://github.com/dhis2/dashboard-app/compare/v31.15.0...v31.15.1) (2021-05-06)


### Bug Fixes

* sync translations from transifex (master) ([#1701](https://github.com/dhis2/dashboard-app/issues/1701)) ([971b2b9](https://github.com/dhis2/dashboard-app/commit/971b2b96883f5f1e1f95d9572920b8c6ccc41743))

# [31.15.0](https://github.com/dhis2/dashboard-app/compare/v31.14.11...v31.15.0) (2021-04-27)


### Bug Fixes

* make New button icon-only and set redirect url rather than use Link component ([#1714](https://github.com/dhis2/dashboard-app/issues/1714)) ([686d970](https://github.com/dhis2/dashboard-app/commit/686d970cd40e0025916515ef3c02892a1bb3d8db))
* namespace check issue ([#1725](https://github.com/dhis2/dashboard-app/issues/1725)) ([0997714](https://github.com/dhis2/dashboard-app/commit/0997714d89580c3b76a7e2510d760edbc3084155))


### Features

* add confirmation dialog for discarding changes to dashboard ([#1713](https://github.com/dhis2/dashboard-app/issues/1713)) ([0fd4d1c](https://github.com/dhis2/dashboard-app/commit/0fd4d1c2f988fc3307ad308babe96f6382cd650b))

## [31.14.11](https://github.com/dhis2/dashboard-app/compare/v31.14.10...v31.14.11) (2021-04-20)


### Bug Fixes

* remove material-ui as direct dependency and update to latest ui design DHIS2-10143 ([#1704](https://github.com/dhis2/dashboard-app/issues/1704)) ([4f4cc50](https://github.com/dhis2/dashboard-app/commit/4f4cc50b209fed3e3a93194357540535b0ffc242))

## [31.14.10](https://github.com/dhis2/dashboard-app/compare/v31.14.9...v31.14.10) (2021-03-30)


### Bug Fixes

* expanded control bar not resizing on drag [DHIS2-10795] ([#1681](https://github.com/dhis2/dashboard-app/issues/1681)) ([e857c03](https://github.com/dhis2/dashboard-app/commit/e857c03e05dbbb1e6eb8ac98b5d90acfe79e3257))

## [31.14.9](https://github.com/dhis2/dashboard-app/compare/v31.14.8...v31.14.9) (2021-03-30)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([#1647](https://github.com/dhis2/dashboard-app/issues/1647)) ([2e8677c](https://github.com/dhis2/dashboard-app/commit/2e8677c6fd57fdef622590a39371adbe79959f7f))

## [31.14.8](https://github.com/dhis2/dashboard-app/compare/v31.14.7...v31.14.8) (2021-03-26)


### Bug Fixes

* makes Add filter button's display conditional ([#1677](https://github.com/dhis2/dashboard-app/issues/1677)) ([8ce4b51](https://github.com/dhis2/dashboard-app/commit/8ce4b513d51a3619802aa31aa3698413d074b30c))

## [31.14.7](https://github.com/dhis2/dashboard-app/compare/v31.14.6...v31.14.7) (2021-03-25)


### Bug Fixes

* check dom element directly to determine if element is fullscreen in order to avoid unnecessary visualization rerenders ([#1672](https://github.com/dhis2/dashboard-app/issues/1672)) ([279f01f](https://github.com/dhis2/dashboard-app/commit/279f01febaca91b6629579b8be5488c2d8576a5a))

## [31.14.6](https://github.com/dhis2/dashboard-app/compare/v31.14.5...v31.14.6) (2021-03-22)


### Bug Fixes

* avoid double rendering of chart visualizations ([#1658](https://github.com/dhis2/dashboard-app/issues/1658)) ([613ae75](https://github.com/dhis2/dashboard-app/commit/613ae754af8d598d1029c6bdfebf85e3840a1e39))
* maps, ev and er were not resizing for fullscreen or item resize in edit mode ([#1659](https://github.com/dhis2/dashboard-app/issues/1659)) ([c56b562](https://github.com/dhis2/dashboard-app/commit/c56b56212f46d7af8484c9dbc64b2cf40402eb36))
* maximum grid width was hanging past right edge of paper in print preview ([#1657](https://github.com/dhis2/dashboard-app/issues/1657)) ([7faf5c2](https://github.com/dhis2/dashboard-app/commit/7faf5c2912d406f0e1c413632206863223fbb091))

## [31.14.5](https://github.com/dhis2/dashboard-app/compare/v31.14.4...v31.14.5) (2021-03-18)


### Bug Fixes

* ctrl bar covered sharing dialog and cypress tests [DHIS2-10691] ([#1652](https://github.com/dhis2/dashboard-app/issues/1652)) ([b18069b](https://github.com/dhis2/dashboard-app/commit/b18069b2afb6cbb112f3310b469f2a85a8679fa9))

## [31.14.4](https://github.com/dhis2/dashboard-app/compare/v31.14.3...v31.14.4) (2021-03-17)


### Bug Fixes

* do not request current dashboard when NEW route ([#1655](https://github.com/dhis2/dashboard-app/issues/1655)) ([b31124a](https://github.com/dhis2/dashboard-app/commit/b31124a2a70c81abd0c17df5b89c692520fa0ae7))
* only request dimensions when needed ([#1654](https://github.com/dhis2/dashboard-app/issues/1654)) ([36eec71](https://github.com/dhis2/dashboard-app/commit/36eec715efdbfd55eae392928cdad91c2acf8a29))

## [31.14.3](https://github.com/dhis2/dashboard-app/compare/v31.14.2...v31.14.3) (2021-03-12)


### Bug Fixes

* @dhis2/analytics@16.0.15, @dhis2/data-visualizer-plugin@35.20.18 ([#1645](https://github.com/dhis2/dashboard-app/issues/1645)) ([bfa9889](https://github.com/dhis2/dashboard-app/commit/bfa9889865b31deebe5f71d0afb1ece65478c8ca))
* **translations:** sync translations from transifex (master) ([#1585](https://github.com/dhis2/dashboard-app/issues/1585)) ([45b3524](https://github.com/dhis2/dashboard-app/commit/45b35248630ffad48bc9597c2dc97e9ecee1c1b6))
* upgrade to @dhis2/cli-app-scripts@6 (DHIS2-9893) ([#1634](https://github.com/dhis2/dashboard-app/issues/1634)) ([662fd6e](https://github.com/dhis2/dashboard-app/commit/662fd6e6a4e8b0418a21acd7238fad8d1df5dcb5))

## [31.14.2](https://github.com/dhis2/dashboard-app/compare/v31.14.1...v31.14.2) (2021-03-11)


### Bug Fixes

* disable View As menu items for maps without a thematic layer [DHIS2-10671] ([#1632](https://github.com/dhis2/dashboard-app/issues/1632)) ([c521111](https://github.com/dhis2/dashboard-app/commit/c521111c23847f336b16cc270568438743530c83))

## [31.14.1](https://github.com/dhis2/dashboard-app/compare/v31.14.0...v31.14.1) (2021-03-11)


### Bug Fixes

* catch errors from the interpretations component ([#1627](https://github.com/dhis2/dashboard-app/issues/1627)) ([cbf4801](https://github.com/dhis2/dashboard-app/commit/cbf4801457326227e9ebe2d6ce39fa7ad21647e0))

# [31.14.0](https://github.com/dhis2/dashboard-app/compare/v31.13.10...v31.14.0) (2021-03-11)


### Features

* lazily load plugin scripts and dependencies when needed (DHIS2-10518) ([#1546](https://github.com/dhis2/dashboard-app/issues/1546)) ([c13eafe](https://github.com/dhis2/dashboard-app/commit/c13eafee33a1f13636bdd80f4dfe5e1107e97322))

## [31.13.10](https://github.com/dhis2/dashboard-app/compare/v31.13.9...v31.13.10) (2021-03-10)


### Bug Fixes

* disable cypress test until complete suite can be fixed ([#1628](https://github.com/dhis2/dashboard-app/issues/1628)) ([152fdf9](https://github.com/dhis2/dashboard-app/commit/152fdf945ccc33b30b0dd6b2cf4cdbc343b2e8e4))

## [31.13.9](https://github.com/dhis2/dashboard-app/compare/v31.13.8...v31.13.9) (2021-03-10)


### Bug Fixes

* use correct plugin for active type when resizing ([#1626](https://github.com/dhis2/dashboard-app/issues/1626)) ([aece09e](https://github.com/dhis2/dashboard-app/commit/aece09e9ec0d33c2ba28bbed562308e37d5715eb))

## [31.13.8](https://github.com/dhis2/dashboard-app/compare/v31.13.7...v31.13.8) (2021-03-10)


### Bug Fixes

* fix double border in More menu ([#1624](https://github.com/dhis2/dashboard-app/issues/1624)) ([42fbaee](https://github.com/dhis2/dashboard-app/commit/42fbaeedb74bb5a456c11cf7a0f4610100843cb1))

## [31.13.7](https://github.com/dhis2/dashboard-app/compare/v31.13.6...v31.13.7) (2021-03-09)


### Bug Fixes

* add scatter icon for ItemSelector ([#1614](https://github.com/dhis2/dashboard-app/issues/1614)) ([66ac287](https://github.com/dhis2/dashboard-app/commit/66ac287f450525f932f433f5d897f89cb4f19384))
* calc fullscreen height of visualization based on window height ([#1621](https://github.com/dhis2/dashboard-app/issues/1621)) ([13c79b9](https://github.com/dhis2/dashboard-app/commit/13c79b94e6b0bd257bd7c76e9bd4241f1f9c7cf0))
* preserve sharing and translations when saving dashboard ([#1611](https://github.com/dhis2/dashboard-app/issues/1611)) ([802405d](https://github.com/dhis2/dashboard-app/commit/802405dc25e784926740bc7dcc033a5de1980e6a)), closes [dhis2/dhis2-core#7538](https://github.com/dhis2/dhis2-core/issues/7538)
* use window height to determine controlbar height ([#1620](https://github.com/dhis2/dashboard-app/issues/1620)) ([d7d730f](https://github.com/dhis2/dashboard-app/commit/d7d730f0e1855286d0aa0a7db51e3643a42c2ed8))

## [31.13.6](https://github.com/dhis2/dashboard-app/compare/v31.13.5...v31.13.6) (2021-03-08)


### Bug Fixes

* DashboardsBar onExpandedChanged must be a function ([#1613](https://github.com/dhis2/dashboard-app/issues/1613)) ([0bc1820](https://github.com/dhis2/dashboard-app/commit/0bc18201217bee80c7509c077d7df32665fcda31))
* progressive loading on small screen fixes ([#1610](https://github.com/dhis2/dashboard-app/issues/1610)) ([cd19ea5](https://github.com/dhis2/dashboard-app/commit/cd19ea5c839999322709c6d7a13f7da823ac4498))

## [31.13.5](https://github.com/dhis2/dashboard-app/compare/v31.13.4...v31.13.5) (2021-03-05)


### Bug Fixes

* use keyAnalysisDisplayProperty from user settings for analytics components ([#1600](https://github.com/dhis2/dashboard-app/issues/1600)) ([35eeb69](https://github.com/dhis2/dashboard-app/commit/35eeb695d1522f5b314b53a6a3a3b0fbc3869e88))

## [31.13.4](https://github.com/dhis2/dashboard-app/compare/v31.13.3...v31.13.4) (2021-03-04)


### Bug Fixes

* decrease dashboard request response load size ([#1596](https://github.com/dhis2/dashboard-app/issues/1596)) ([9ac201f](https://github.com/dhis2/dashboard-app/commit/9ac201fec70039f37befa3b2b0bc9fb0c1090853))

## [31.13.3](https://github.com/dhis2/dashboard-app/compare/v31.13.2...v31.13.3) (2021-03-04)


### Bug Fixes

* do not allow "Open in [appname] app" when in small screen ([#1593](https://github.com/dhis2/dashboard-app/issues/1593)) ([56ad5b5](https://github.com/dhis2/dashboard-app/commit/56ad5b5473fe31172573803fd04ac9b671d79fa2))
* phone landscape scrolling in edit mode was not available ([#1594](https://github.com/dhis2/dashboard-app/issues/1594)) ([6bfc650](https://github.com/dhis2/dashboard-app/commit/6bfc6506eb609aa3e0d5dd0eb9458bdfa108f3a5))
* temporarily disable flaky cypress test ([#1599](https://github.com/dhis2/dashboard-app/issues/1599)) ([b338564](https://github.com/dhis2/dashboard-app/commit/b3385643cd239f765b21f21b03daef26b1ff490b))

## [31.13.2](https://github.com/dhis2/dashboard-app/compare/v31.13.1...v31.13.2) (2021-02-26)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([#1576](https://github.com/dhis2/dashboard-app/issues/1576)) ([b00c878](https://github.com/dhis2/dashboard-app/commit/b00c878ae52849c486bb67750a02d8fa4dbb41a5))

## [31.13.1](https://github.com/dhis2/dashboard-app/compare/v31.13.0...v31.13.1) (2021-02-26)


### Bug Fixes

* ability to restrict dashboard filters [DHIS2-7620] ([#1575](https://github.com/dhis2/dashboard-app/issues/1575)) ([d4531cf](https://github.com/dhis2/dashboard-app/commit/d4531cfb2009e9810a515153efd897a539a29833))

# [31.13.0](https://github.com/dhis2/dashboard-app/compare/v31.12.7...v31.13.0) (2021-02-26)


### Features

* register passive view of dashboards [DHIS2-7016] ([#1572](https://github.com/dhis2/dashboard-app/issues/1572)) ([ddbf65d](https://github.com/dhis2/dashboard-app/commit/ddbf65d2d2608eede94379e087b6870caa185e03))

## [31.12.7](https://github.com/dhis2/dashboard-app/compare/v31.12.6...v31.12.7) (2021-02-25)


### Bug Fixes

* dashboard filter modal should not be available in small screen ([#1567](https://github.com/dhis2/dashboard-app/issues/1567)) ([53db918](https://github.com/dhis2/dashboard-app/commit/53db9183149f6e644897ccb2e888013f298ca0df))

## [31.12.6](https://github.com/dhis2/dashboard-app/compare/v31.12.5...v31.12.6) (2021-02-25)


### Bug Fixes

* remove div around content that blocked scrolling while adding items to new dashboard ([#1573](https://github.com/dhis2/dashboard-app/issues/1573)) ([19beb57](https://github.com/dhis2/dashboard-app/commit/19beb578e9f5647c7c222c3eaa9f28210626f0e7))

## [31.12.5](https://github.com/dhis2/dashboard-app/compare/v31.12.4...v31.12.5) (2021-02-24)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([#1508](https://github.com/dhis2/dashboard-app/issues/1508)) ([2b92f87](https://github.com/dhis2/dashboard-app/commit/2b92f876934e681e404f0231547cdade043e27b1))
* get value for margins and padding from css when calculating item available height  ([#1566](https://github.com/dhis2/dashboard-app/issues/1566)) ([cce74db](https://github.com/dhis2/dashboard-app/commit/cce74db50a49124f443b6a541a131c11323208bc))

## [31.12.4](https://github.com/dhis2/dashboard-app/compare/v31.12.3...v31.12.4) (2021-02-22)


### Bug Fixes

* position loading spinner at top of item ([#1564](https://github.com/dhis2/dashboard-app/issues/1564)) ([47c7647](https://github.com/dhis2/dashboard-app/commit/47c7647c458f48ae780b3018dfe324b478286684))

## [31.12.3](https://github.com/dhis2/dashboard-app/compare/v31.12.2...v31.12.3) (2021-02-22)


### Bug Fixes

* controlbar should always take full width, and other minor position adjustments ([#1563](https://github.com/dhis2/dashboard-app/issues/1563)) ([5d6d704](https://github.com/dhis2/dashboard-app/commit/5d6d704e64273a8154df42ce3630dd895897ee36))

## [31.12.2](https://github.com/dhis2/dashboard-app/compare/v31.12.1...v31.12.2) (2021-02-22)


### Bug Fixes

* debounce the item selector query in dashboard editor [DHIS2-10530] ([#1554](https://github.com/dhis2/dashboard-app/issues/1554)) ([349b305](https://github.com/dhis2/dashboard-app/commit/349b305a582607b82598c8610ddbacf6107d191e))
* upgrade to ui6 and set resolutions ([#1557](https://github.com/dhis2/dashboard-app/issues/1557)) ([a065cd3](https://github.com/dhis2/dashboard-app/commit/a065cd328dc2fc7703742950bc9c4da3b5bfb845))

## [31.12.1](https://github.com/dhis2/dashboard-app/compare/v31.12.0...v31.12.1) (2021-02-18)


### Bug Fixes

* spacing between titlebar and filter badge ([#1551](https://github.com/dhis2/dashboard-app/issues/1551)) ([45d90d5](https://github.com/dhis2/dashboard-app/commit/45d90d54f2bc795618684dbe37094139eb5a491b))

# [31.12.0](https://github.com/dhis2/dashboard-app/compare/v31.11.2...v31.12.0) (2021-02-18)


### Features

* scroll away control bar when viewing dashboard on screen with height <=480px ([#1550](https://github.com/dhis2/dashboard-app/issues/1550)) ([0caf0d8](https://github.com/dhis2/dashboard-app/commit/0caf0d8c539ca2c50ba6d7d05eb7f2049e645371))

## [31.11.2](https://github.com/dhis2/dashboard-app/compare/v31.11.1...v31.11.2) (2021-02-17)


### Bug Fixes

* hide filter modal when in small screen [DHIS2-10439, DHIS2-10138] ([#1545](https://github.com/dhis2/dashboard-app/issues/1545)) ([b81a1f4](https://github.com/dhis2/dashboard-app/commit/b81a1f4051d1908f115a444289ced5cf3e5632d6))

## [31.11.1](https://github.com/dhis2/dashboard-app/compare/v31.11.0...v31.11.1) (2021-02-17)


### Bug Fixes

* control bar refactor ([#1529](https://github.com/dhis2/dashboard-app/issues/1529)) ([84dde66](https://github.com/dhis2/dashboard-app/commit/84dde66a933d09dc9a055c843a14569c593932e2))

# [31.11.0](https://github.com/dhis2/dashboard-app/compare/v31.10.9...v31.11.0) (2021-02-15)


### Features

* Restricting view options of dashboard items (DHIS2-7630) ([#1472](https://github.com/dhis2/dashboard-app/issues/1472)) ([e74ee29](https://github.com/dhis2/dashboard-app/commit/e74ee2940010dece08b7b51624928d96e37473e7))

## [31.10.9](https://github.com/dhis2/dashboard-app/compare/v31.10.8...v31.10.9) (2021-02-12)


### Bug Fixes

* add css class for expanded control bar ([286c1ae](https://github.com/dhis2/dashboard-app/commit/286c1ae135a52b0882eaa3725cdf718fb8d2b2bc))
* clean dashboard bar height calculation function ([71bb64d](https://github.com/dhis2/dashboard-app/commit/71bb64dab08d83e77f6f97fb95dca1fe90960417))
* make space to left of dashboard items scrollable [DHIS2-10138] ([#1523](https://github.com/dhis2/dashboard-app/issues/1523)) ([3305aa3](https://github.com/dhis2/dashboard-app/commit/3305aa3da397bba419840e7162011fad81c81b60))
* remove inline style calculation height for small, dashboardbar chip container and controlbar ([99dea63](https://github.com/dhis2/dashboard-app/commit/99dea6301a37362d424d66d6f5caff297d7993d5))
* update dashboard bar snapshot ([1caac43](https://github.com/dhis2/dashboard-app/commit/1caac4347b9202e67005600c595c27d9a57c63d6))

## [31.10.8](https://github.com/dhis2/dashboard-app/compare/v31.10.7...v31.10.8) (2021-02-09)


### Bug Fixes

* restore star dashboard functionality ([#1507](https://github.com/dhis2/dashboard-app/issues/1507)) ([4d625af](https://github.com/dhis2/dashboard-app/commit/4d625af7c1e36754964981e177586bb8d561c7f9))

## [31.10.7](https://github.com/dhis2/dashboard-app/compare/v31.10.6...v31.10.7) (2021-02-09)


### Bug Fixes

* add small More button for small screen [DHIS2-10424] ([#1511](https://github.com/dhis2/dashboard-app/issues/1511)) ([95c4511](https://github.com/dhis2/dashboard-app/commit/95c4511cd02e7a05e77fef02162ad4a672d14811))

## [31.10.6](https://github.com/dhis2/dashboard-app/compare/v31.10.5...v31.10.6) (2021-02-08)


### Bug Fixes

* improve positioning of the X button in the dashboard search input ([#1512](https://github.com/dhis2/dashboard-app/issues/1512)) ([b8b6dde](https://github.com/dhis2/dashboard-app/commit/b8b6dde01f2e98236d06ff900f18d040a0d1f911))

## [31.10.5](https://github.com/dhis2/dashboard-app/compare/v31.10.4...v31.10.5) (2021-02-08)


### Bug Fixes

* calculations for height of interpretations expansion panel in small screen ([#1510](https://github.com/dhis2/dashboard-app/issues/1510)) ([d2e78c7](https://github.com/dhis2/dashboard-app/commit/d2e78c747652fcfc62ae3f0a9986275bc8e1f275))

## [31.10.4](https://github.com/dhis2/dashboard-app/compare/v31.10.3...v31.10.4) (2021-02-08)


### Bug Fixes

* provide more informative message when edit mode becomes unavailable [DHIS2-10138] ([#1514](https://github.com/dhis2/dashboard-app/issues/1514)) ([4e080bb](https://github.com/dhis2/dashboard-app/commit/4e080bb961ff50371860e1f24fee44fa1d96d71a))

## [31.10.3](https://github.com/dhis2/dashboard-app/compare/v31.10.2...v31.10.3) (2021-02-04)


### Bug Fixes

* change order of save process to avoid memory leaks and add alert for failed save ([#1501](https://github.com/dhis2/dashboard-app/issues/1501)) ([5cfe18f](https://github.com/dhis2/dashboard-app/commit/5cfe18f19ec1905f507836265b1296089b0145d3))

## [31.10.2](https://github.com/dhis2/dashboard-app/compare/v31.10.1...v31.10.2) (2021-02-03)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([#1420](https://github.com/dhis2/dashboard-app/issues/1420)) ([03c4697](https://github.com/dhis2/dashboard-app/commit/03c469780eb486dc5108132bcbe6c3fb9f86fbe9))

## [31.10.1](https://github.com/dhis2/dashboard-app/compare/v31.10.0...v31.10.1) (2021-01-29)


### Bug Fixes

* fullscreen param to map plugin resize ([#1484](https://github.com/dhis2/dashboard-app/issues/1484)) ([9da5b0c](https://github.com/dhis2/dashboard-app/commit/9da5b0c97fa94c736f8c738953906465c3c08fe8))

# [31.10.0](https://github.com/dhis2/dashboard-app/compare/v31.9.0...v31.10.0) (2021-01-29)


### Features

* responsive item grid in view and edit mode [DHIS2-10138] ([#1431](https://github.com/dhis2/dashboard-app/issues/1431)) ([0e0c93f](https://github.com/dhis2/dashboard-app/commit/0e0c93f5399117ee91ee99f899374fc68f2b355a))

# [31.9.0](https://github.com/dhis2/dashboard-app/compare/v31.8.0...v31.9.0) (2021-01-29)


### Features

* set expanded control bar height for small screens ([#1459](https://github.com/dhis2/dashboard-app/issues/1459)) ([0d009ae](https://github.com/dhis2/dashboard-app/commit/0d009ae96d5e86511f97ccf1211aaa9fd2896e66))

# [31.8.0](https://github.com/dhis2/dashboard-app/compare/v31.7.1...v31.8.0) (2021-01-28)


### Features

* responsive - redirect to view when url of /edit or /new manually entered [DHIS2-10138] ([#1473](https://github.com/dhis2/dashboard-app/issues/1473)) ([de3e1a6](https://github.com/dhis2/dashboard-app/commit/de3e1a6e32260d60f5caaf4b8114c1b1b7a9d34a))

## [31.7.1](https://github.com/dhis2/dashboard-app/compare/v31.7.0...v31.7.1) (2021-01-25)


### Bug Fixes

* trigger event to hide tooltip when click wasnt on button ([#1461](https://github.com/dhis2/dashboard-app/issues/1461)) ([b87604c](https://github.com/dhis2/dashboard-app/commit/b87604ca442539e15e80651a5dbb628420376181))

# [31.7.0](https://github.com/dhis2/dashboard-app/compare/v31.6.2...v31.7.0) (2021-01-25)


### Features

* print layout padding and grid width ([#1460](https://github.com/dhis2/dashboard-app/issues/1460)) ([b06b427](https://github.com/dhis2/dashboard-app/commit/b06b427855285feecc056e0a42d56269614bbd32))

## [31.6.2](https://github.com/dhis2/dashboard-app/compare/v31.6.1...v31.6.2) (2021-01-19)


### Bug Fixes

* Adjust position of the title to be in line with action buttons in small screen mode ([#1449](https://github.com/dhis2/dashboard-app/issues/1449)) ([844a12f](https://github.com/dhis2/dashboard-app/commit/844a12f7ba10e3f18865e8c0c5cd550f5689de7d))

## [31.6.1](https://github.com/dhis2/dashboard-app/compare/v31.6.0...v31.6.1) (2021-01-14)


### Bug Fixes

* add margin on all sides of notice box ([#1445](https://github.com/dhis2/dashboard-app/issues/1445)) ([ce8b5e5](https://github.com/dhis2/dashboard-app/commit/ce8b5e5eb42a59e027e723a8de0b02e20481027b))

# [31.6.0](https://github.com/dhis2/dashboard-app/compare/v31.5.0...v31.6.0) (2021-01-12)


### Features

* responsive - disallow editing in small screen ([#1419](https://github.com/dhis2/dashboard-app/issues/1419)) ([9932951](https://github.com/dhis2/dashboard-app/commit/99329516a898b78a32607129ceb6fa5fc9eae81b))

# [31.5.0](https://github.com/dhis2/dashboard-app/compare/v31.4.1...v31.5.0) (2021-01-11)


### Features

* responsive control bar and title bar [DHIS2-10138] ([#1400](https://github.com/dhis2/dashboard-app/issues/1400)) ([7b6af12](https://github.com/dhis2/dashboard-app/commit/7b6af12125348cdf4491334699acde95c36fe3f6))

## [31.4.1](https://github.com/dhis2/dashboard-app/compare/v31.4.0...v31.4.1) (2021-01-06)


### Bug Fixes

* restore commented test and remove unused file ([#1430](https://github.com/dhis2/dashboard-app/issues/1430)) ([8c4acf5](https://github.com/dhis2/dashboard-app/commit/8c4acf5bed2c76010bca41b64ef4c4a9becd6713))

# [31.4.0](https://github.com/dhis2/dashboard-app/compare/v31.3.1...v31.4.0) (2021-01-05)


### Features

* add fullscreen option to visualization items [DHIS2-9879] ([#1358](https://github.com/dhis2/dashboard-app/issues/1358)) ([746d7b0](https://github.com/dhis2/dashboard-app/commit/746d7b00321d96a5ae2bcd6959842db5fb99f2f3)), closes [cypress-io/cypress#7776](https://github.com/cypress-io/cypress/issues/7776)

## [31.3.1](https://github.com/dhis2/dashboard-app/compare/v31.3.0...v31.3.1) (2021-01-05)


### Bug Fixes

* disable test affected by api bug ([#1418](https://github.com/dhis2/dashboard-app/issues/1418)) ([e01f98b](https://github.com/dhis2/dashboard-app/commit/e01f98b344656255539df14a7dd5f0e9d3d1cf61))
* **translations:** sync translations from transifex (master) ([#1403](https://github.com/dhis2/dashboard-app/issues/1403)) ([bd1c113](https://github.com/dhis2/dashboard-app/commit/bd1c1136eda2aad13286bce04444424857c59e71))

# [31.3.0](https://github.com/dhis2/dashboard-app/compare/v31.2.0...v31.3.0) (2020-12-15)


### Features

* add support for gathering data statistics on visualization views [DHIS2-9554] ([#1394](https://github.com/dhis2/dashboard-app/issues/1394)) ([380ba29](https://github.com/dhis2/dashboard-app/commit/380ba29db8f0afa4b3ba82a9cb2659c0304da8a5))

# [31.2.0](https://github.com/dhis2/dashboard-app/compare/v31.1.3...v31.2.0) (2020-12-15)


### Features

* hide app title in View mode if specified in the app manifest (DHIS2-9605) ([#1393](https://github.com/dhis2/dashboard-app/issues/1393)) ([cdb3469](https://github.com/dhis2/dashboard-app/commit/cdb346954a194a511562fbc638523b7fcc8df857))

## [31.1.3](https://github.com/dhis2/dashboard-app/compare/v31.1.2...v31.1.3) (2020-12-15)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([#1370](https://github.com/dhis2/dashboard-app/issues/1370)) ([8022f1c](https://github.com/dhis2/dashboard-app/commit/8022f1ce7c874b5e0f9703c219c164c0fdf93f49))

## [31.1.2](https://github.com/dhis2/dashboard-app/compare/v31.1.1...v31.1.2) (2020-12-08)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([#1347](https://github.com/dhis2/dashboard-app/issues/1347)) ([94b4224](https://github.com/dhis2/dashboard-app/commit/94b4224a99978ec9ec8f19e629737e1bccf2f22f))

## [31.1.1](https://github.com/dhis2/dashboard-app/compare/v31.1.0...v31.1.1) (2020-12-02)


### Bug Fixes

* install the Cypress binary for the e2e tests ([#1340](https://github.com/dhis2/dashboard-app/issues/1340)) ([6512165](https://github.com/dhis2/dashboard-app/commit/6512165813cc1d7b71d5901bf98be528330a30b7))

# [31.1.0](https://github.com/dhis2/dashboards-app/compare/v31.0.1...v31.1.0) (2020-11-26)


### Bug Fixes

* **translations:** sync translations from transifex (master) ([3e55743](https://github.com/dhis2/dashboards-app/commit/3e55743f00e5b7ed738fa0fb175b565a320cd344))
* dashboard filter - filter dialog incorrectly shows filter as selected even though it was removed [DHIS2-9560] ([#1074](https://github.com/dhis2/dashboards-app/issues/1074)) ([54be7c3](https://github.com/dhis2/dashboards-app/commit/54be7c3ded0bce21087015f0a69fb3e9a2a21b97))
* flyoutMenu thinks every item is a flyout and stops propagation ([#1326](https://github.com/dhis2/dashboards-app/issues/1326)) ([326dd53](https://github.com/dhis2/dashboards-app/commit/326dd535a5a073ae4feeac52e66952dac1bd37d7))
* **translations:** sync translations from transifex (master) ([08d2ca0](https://github.com/dhis2/dashboards-app/commit/08d2ca0649c0ac1de155416ca27d86a163b97487))
* **translations:** sync translations from transifex (master) ([32590e4](https://github.com/dhis2/dashboards-app/commit/32590e47f006887d2ddb1885dadba2f9db0ba500))
* **translations:** sync translations from transifex (master) ([f1b76c4](https://github.com/dhis2/dashboards-app/commit/f1b76c41d7691f378dfdb69404959c71389476a8))
* **translations:** sync translations from transifex (master) ([2ef2caa](https://github.com/dhis2/dashboards-app/commit/2ef2caaf5cb48f1c41c46c535071b461bde6502e))
* **translations:** sync translations from transifex (master) ([9dc9a2a](https://github.com/dhis2/dashboards-app/commit/9dc9a2a81943140b5f0c19e19be05bdcfa1254e5))
* **translations:** sync translations from transifex (master) ([a10cc54](https://github.com/dhis2/dashboards-app/commit/a10cc54d33f58ee22fd9e3ee64348fe7dfe93403))
* **translations:** sync translations from transifex (master) ([fac8f80](https://github.com/dhis2/dashboards-app/commit/fac8f80541c62d8099d9341a2fb11da0a2f7b115))
* **translations:** sync translations from transifex (master) ([e7982d6](https://github.com/dhis2/dashboards-app/commit/e7982d68d8a7d80f4e602658a84ecca571582e4e))
* **translations:** sync translations from transifex (master) ([838e1a1](https://github.com/dhis2/dashboards-app/commit/838e1a17aa695c3d0c3d92cd34aa6f2889976714))
* **translations:** sync translations from transifex (master) ([d19c13f](https://github.com/dhis2/dashboards-app/commit/d19c13f8a1765fa9a5031bda80967962ab0f3f7a))
* **translations:** sync translations from transifex (master) ([3c4f359](https://github.com/dhis2/dashboards-app/commit/3c4f35970f4d8d1533b748f97381bc22a5556453))
* **translations:** sync translations from transifex (master) ([b3b8a49](https://github.com/dhis2/dashboards-app/commit/b3b8a4948c7ee5fe61396ea31b1c451b01534003))
* **translations:** sync translations from transifex (master) ([bfb34df](https://github.com/dhis2/dashboards-app/commit/bfb34dfe6399bd3d90635ea124ac2d9495992127))
* **translations:** sync translations from transifex (master) ([1cbadba](https://github.com/dhis2/dashboards-app/commit/1cbadbaf9a2ab9e4a2d786ebaa97d9305a34a53e))
* **translations:** sync translations from transifex (master) ([#1295](https://github.com/dhis2/dashboards-app/issues/1295)) ([b8fdac9](https://github.com/dhis2/dashboards-app/commit/b8fdac94b4108f20507f2e4bb2c4880a2ea32074))
* **translations:** sync translations from transifex (master) ([#1323](https://github.com/dhis2/dashboards-app/issues/1323)) ([26f5d8c](https://github.com/dhis2/dashboards-app/commit/26f5d8c43d30de472ffe1f9d75f1e78c3f1abc0a))
* force type COLUMN when viewing table as chart [DHIS2-9599] ([#1317](https://github.com/dhis2/dashboards-app/issues/1317)) ([fd2f1bb](https://github.com/dhis2/dashboards-app/commit/fd2f1bb6111cc3677f4ef56d32ebc93545458e47))
* ou item filter on App items was crashing Dashboards [DHIS2-9725] ([#1183](https://github.com/dhis2/dashboards-app/issues/1183)) ([614a42f](https://github.com/dhis2/dashboards-app/commit/614a42f872a9f2b066be348b91faf54285931b9f))
* restore schemas list needed for orgunitdlg and interpretations ([#1307](https://github.com/dhis2/dashboards-app/issues/1307)) ([4e3c83e](https://github.com/dhis2/dashboards-app/commit/4e3c83ec64d755484bd18c36469341b5c208f6f8))
* switching from table to chart shows wrong data [DHIS2-9599] ([#1196](https://github.com/dhis2/dashboards-app/issues/1196)) ([ab60389](https://github.com/dhis2/dashboards-app/commit/ab60389bc0d93f51a193811a333c422f770728b4))
* try another format ([cc0df29](https://github.com/dhis2/dashboards-app/commit/cc0df29861024f81b7539984ed3194510414c00f))
* **translations:** sync translations from transifex (master) ([b4e24fb](https://github.com/dhis2/dashboards-app/commit/b4e24fb3b4e55840f415594a8e439b70400642fe))
* **translations:** sync translations from transifex (master) ([184a45e](https://github.com/dhis2/dashboards-app/commit/184a45e31db27ecf6a1dd953907f399eaeabc244))
* **translations:** sync translations from transifex (master) ([1cc0b5d](https://github.com/dhis2/dashboards-app/commit/1cc0b5deb785b93193fd9b0d7bb4d695d907ee75))
* **translations:** sync translations from transifex (master) ([088e02a](https://github.com/dhis2/dashboards-app/commit/088e02ac1178443f175ba8f50de4c4d215af8aaa))
* allow series in the request string ([#1148](https://github.com/dhis2/dashboards-app/issues/1148)) ([ef7d04e](https://github.com/dhis2/dashboards-app/commit/ef7d04e084fe202c7770f1057a65210d066e145a))
* changing View As on one item was incorrectly causing other items to also change view [DHIS2-9590] ([#1111](https://github.com/dhis2/dashboards-app/issues/1111)) ([436b354](https://github.com/dhis2/dashboards-app/commit/436b35446e91b18cf99306a6b472392d8e64792c))
* check whether the dashboard id has been set after the check for existing dashboards [DHIS2-9738] ([#1164](https://github.com/dhis2/dashboards-app/issues/1164)) ([05a8413](https://github.com/dhis2/dashboards-app/commit/05a841380d0c2be4b42c52c759e7f4a818e5ce7d))
* use better spacing in item title when the title wraps to multiple lines ([#1099](https://github.com/dhis2/dashboards-app/issues/1099)) ([f76ed0e](https://github.com/dhis2/dashboards-app/commit/f76ed0eabfa11e5e69b93bd16d27964a2231ee05))
* use correct prop name for D2Shim ([#1202](https://github.com/dhis2/dashboards-app/issues/1202)) ([5d521c6](https://github.com/dhis2/dashboards-app/commit/5d521c6c3c30b49bf95af480a478f5ba2dbbf861))
* **translations:** sync translations from transifex (master) ([b01a670](https://github.com/dhis2/dashboards-app/commit/b01a670ee86669947802ab6a9536051849d19772))
* add info in print preview about items that were shortened to fit on page [DHIS2-9423] ([#1045](https://github.com/dhis2/dashboards-app/issues/1045)) ([fde9ef1](https://github.com/dhis2/dashboards-app/commit/fde9ef1f0628bedea49d6853b380b8c0967b20bb))
* apply scrollbar to the dashboard area below the control bars and headerbar [DHIS2-9371] ([#1034](https://github.com/dhis2/dashboards-app/issues/1034)) ([ed049fe](https://github.com/dhis2/dashboards-app/commit/ed049fed56c6fde691a178bbb60d793f049a1237))
* bump Analytics to v11.0.5 and DV plugin to latest ([#1097](https://github.com/dhis2/dashboards-app/issues/1097)) ([b1d7fab](https://github.com/dhis2/dashboards-app/commit/b1d7fabd0d024cca5e19ce937df5733b4771da47))
* console warning about invalid dom nesting ([#1049](https://github.com/dhis2/dashboards-app/issues/1049)) ([7039355](https://github.com/dhis2/dashboards-app/commit/7039355305c32e6233dcafdca22da435bd0eda73))
* filter bar position (DHIS2-9453) ([#1073](https://github.com/dhis2/dashboards-app/issues/1073)) ([f573db0](https://github.com/dhis2/dashboards-app/commit/f573db0e55931b413cff425b71687fcd75bfd2e3))
* include title page in edit preview but scroll to below it [DHIS2-9417] ([#1038](https://github.com/dhis2/dashboards-app/issues/1038)) ([2c49410](https://github.com/dhis2/dashboards-app/commit/2c49410b5e1e96b43624c2b9f1a9c6d56b4589e9))
* patch rgl with fix ([#1046](https://github.com/dhis2/dashboards-app/issues/1046)) ([33b046d](https://github.com/dhis2/dashboards-app/commit/33b046dc9f72e65a4afc7739026468313687a726))
* print preview wasnt calculating page bottom correctly ([#1028](https://github.com/dhis2/dashboards-app/issues/1028)) ([505ad07](https://github.com/dhis2/dashboards-app/commit/505ad07208cbc92ca1382257f5cec8604f7308fd))
* remove unhelpful warning ([#1064](https://github.com/dhis2/dashboards-app/issues/1064)) ([d6e27e9](https://github.com/dhis2/dashboards-app/commit/d6e27e920e0b798537c075c1f38c9f00dcecbfe4))
* save default dashboard title if user does not provide a title [DHIS2-9234] ([#1022](https://github.com/dhis2/dashboards-app/issues/1022)) ([32d390d](https://github.com/dhis2/dashboards-app/commit/32d390dda5f2f8b9e66865f5e6b0b381cb48512a))
* scroll to top when switching dashboard ([#1040](https://github.com/dhis2/dashboards-app/issues/1040)) ([b7e6fab](https://github.com/dhis2/dashboards-app/commit/b7e6fabe564b90ad0d1d034f95586c3b95c8d15c))
* set overflow to hidden for vis and map items ([#1050](https://github.com/dhis2/dashboards-app/issues/1050)) ([d3b8d93](https://github.com/dhis2/dashboards-app/commit/d3b8d9357291397e0e7de359c8ce457f4f6f8798))
* set passive to true for scroll event listener in ProgressiveLoadingContainer [DHIS2-9508] ([#1084](https://github.com/dhis2/dashboards-app/issues/1084)) ([763881b](https://github.com/dhis2/dashboards-app/commit/763881b99cdc4728d7de4077e82a729fee79d30f))
* unmount map when switching dashboard mode or changing active type [DHIS2-9558] ([#1083](https://github.com/dhis2/dashboards-app/issues/1083)) ([147000e](https://github.com/dhis2/dashboards-app/commit/147000ebfdd46ab7aad7f677f47c5eb2cfad1085))
* upgrade plugin and analytics ([#1105](https://github.com/dhis2/dashboards-app/issues/1105)) ([db98d5c](https://github.com/dhis2/dashboards-app/commit/db98d5c7b1c4a97a0ffd2ecb8c67a6c0f3886cb4))
* **translations:** sync translations from transifex (master) ([0a41693](https://github.com/dhis2/dashboards-app/commit/0a41693007c960d48c1aa4508d723982f6d1b582))
* **translations:** sync translations from transifex (master) ([491d592](https://github.com/dhis2/dashboards-app/commit/491d59202653f02bc14fa14fccab44c6e4764c73))
* setting selectedId to null caused endless spinner [DHIS2-9337] ([5e899a4](https://github.com/dhis2/dashboards-app/commit/5e899a4bbbae846f9148a1af9bb79e65ae980d12))
* tweak info text and style ([#1048](https://github.com/dhis2/dashboards-app/issues/1048)) ([207530b](https://github.com/dhis2/dashboards-app/commit/207530b7fea32719369518c9a4feb8401e86d20e))
* use hooks to exert finer control on setting dashboard [DHIS2-9508] ([#1067](https://github.com/dhis2/dashboards-app/issues/1067)) ([96f50f2](https://github.com/dhis2/dashboards-app/commit/96f50f2de5442dc25f79ccfeb9894ef16b7fb7bc))
* **translations:** sync translations from transifex (master) ([7badec8](https://github.com/dhis2/dashboards-app/commit/7badec8a0c3d1f0e8d2299d60c1571d9ced78e90))
* **translations:** sync translations from transifex (master) ([6a2bb23](https://github.com/dhis2/dashboards-app/commit/6a2bb230860366b1d050b0ab28e3d1559be9adfe))
* update analytics and dv-plugin ([#1039](https://github.com/dhis2/dashboards-app/issues/1039)) ([d726aae](https://github.com/dhis2/dashboards-app/commit/d726aae8f7f12b5de4713ff2598b663dc8aaac26))
* update dashboard scrollbar based on changes to window height [DHIS2-9427] ([#1047](https://github.com/dhis2/dashboards-app/issues/1047)) ([91999c7](https://github.com/dhis2/dashboards-app/commit/91999c73846518620cd94f0828e21046229d51b3))
* **translations:** sync translations from transifex (master) ([9dfdbfd](https://github.com/dhis2/dashboards-app/commit/9dfdbfdf0846e7157da62ec3b3955d7963612f1e))
* **translations:** sync translations from transifex (master) ([27a864d](https://github.com/dhis2/dashboards-app/commit/27a864dfb87d48e4a3125720c9d3643cdc77af75))
* **translations:** sync translations from transifex (master) ([b1805ad](https://github.com/dhis2/dashboards-app/commit/b1805ada04da52bea9292e91abbffff7cc24f015))
* **translations:** sync translations from transifex (master) ([99a89e4](https://github.com/dhis2/dashboards-app/commit/99a89e478d857e8a3cd44b0740181ede4cbd4e7c))
* @dhis2/data-visualizer-plugin@33.1.1 ([#334](https://github.com/dhis2/dashboards-app/issues/334)) ([ffce4e5](https://github.com/dhis2/dashboards-app/commit/ffce4e58b3cbf6f19b0aef88deb6244af638cfb6))
* base url in production ([#1014](https://github.com/dhis2/dashboards-app/issues/1014)) ([4e63032](https://github.com/dhis2/dashboards-app/commit/4e63032d300c47567d98d9918bafde6536d2e6b1))
* **translations:** sync translations from transifex (master) ([7835db2](https://github.com/dhis2/dashboards-app/commit/7835db2f8196f90d2c23f733d7028c09e790b6bb))
* add some more space above description ([#1004](https://github.com/dhis2/dashboards-app/issues/1004)) ([77dbf1f](https://github.com/dhis2/dashboards-app/commit/77dbf1faee6d4ccc4ae0bbf1a8befacd84ddee38))
* **translations:** sync translations from transifex (master) ([6097637](https://github.com/dhis2/dashboards-app/commit/60976378e185e6b069cfe77c368b39794b6905a8))
* **translations:** sync translations from transifex (master) ([f0cf309](https://github.com/dhis2/dashboards-app/commit/f0cf30992475d8a0608db55a58e67642c360d226))
* **translations:** sync translations from transifex (master) ([f849d52](https://github.com/dhis2/dashboards-app/commit/f849d52b1f3b52a30b5500d2d81c8316c2df7983))
* @dhis2/data-visualizer-plugin@33.1.2 ([#335](https://github.com/dhis2/dashboards-app/issues/335)) ([8e65eef](https://github.com/dhis2/dashboards-app/commit/8e65eeff7ea47dab92e2c04c348be3e942387fb2))
* add missing reset css for lists ([#700](https://github.com/dhis2/dashboards-app/issues/700)) ([d73a618](https://github.com/dhis2/dashboards-app/commit/d73a61881d275d14a9136e73a83304fbbb1723ed))
* add title proptype for item header ([#525](https://github.com/dhis2/dashboards-app/issues/525)) ([1fef3e3](https://github.com/dhis2/dashboards-app/commit/1fef3e38c252c7073a966b3d9637e5e21de04fbb))
* analytics@4.3.25-plugin@34.3.34 ([#691](https://github.com/dhis2/dashboards-app/issues/691)) ([119e4f1](https://github.com/dhis2/dashboards-app/commit/119e4f160921e3b60aee2b32d1c890183c88bb3c))
* calculate item height accounting for long title [DHIS2-8492] ([#664](https://github.com/dhis2/dashboards-app/issues/664)) ([e1f73c9](https://github.com/dhis2/dashboards-app/commit/e1f73c9476943d350fb6edeee33e9d40fd868509))
* clear the item filters after the dashboard has been switched ([#612](https://github.com/dhis2/dashboards-app/issues/612)) ([8d8357f](https://github.com/dhis2/dashboards-app/commit/8d8357faa40944f8ab45f75250842522714303e3))
* cli-style commit hooks ([#520](https://github.com/dhis2/dashboards-app/issues/520)) ([f5bdc85](https://github.com/dhis2/dashboards-app/commit/f5bdc855857764c731b38cd7fca85771d82af6cb))
* conditionally show the Show More button in item selector ([#326](https://github.com/dhis2/dashboards-app/issues/326)) ([09d4c87](https://github.com/dhis2/dashboards-app/commit/09d4c879e11562fde0b01a780285eb302e9ccc68))
* dashboard filter clear button ([#343](https://github.com/dhis2/dashboards-app/issues/343)) ([7e681d5](https://github.com/dhis2/dashboards-app/commit/7e681d581602611ea96d128020e8aae6d9ee5ec1))
* dashboards loading spinner (DHIS2-8384) + flash bug ([#613](https://github.com/dhis2/dashboards-app/issues/613)) ([ce2535b](https://github.com/dhis2/dashboards-app/commit/ce2535bae6d99efb805d4dc37f447429543baea1))
* data-visualizer-plugin@34.3.30 (DHIS2-8476) ([#662](https://github.com/dhis2/dashboards-app/issues/662)) ([b6b03c0](https://github.com/dhis2/dashboards-app/commit/b6b03c0808c7cfa14523dd05062e980ca721a12e))
* data-visualizer-plugin@34.3.31 (DHIS2-8486) ([#663](https://github.com/dhis2/dashboards-app/issues/663)) ([4be5a31](https://github.com/dhis2/dashboards-app/commit/4be5a31ada117a3fc012c07f4754eada727aabc4))
* dimensions as array (DHIS2-7787) ([#526](https://github.com/dhis2/dashboards-app/issues/526)) ([3647034](https://github.com/dhis2/dashboards-app/commit/36470341071abd5bf8bbf1e0660579e13af058cb))
* edit mode performance improvements ([#617](https://github.com/dhis2/dashboards-app/issues/617)) ([d8bcb58](https://github.com/dhis2/dashboards-app/commit/d8bcb580dec2b34a994271de52ab344a53b00cb8))
* fall back to old types for visualizations ([#524](https://github.com/dhis2/dashboards-app/issues/524)) ([fbe93f4](https://github.com/dhis2/dashboards-app/commit/fbe93f4b09dc8b3d18d9d1255187fc131e3e410f))
* filter redesign ([#528](https://github.com/dhis2/dashboards-app/issues/528)) ([852459c](https://github.com/dhis2/dashboards-app/commit/852459c83b08b9be02182f6a7773821fb7f7818e))
* filter width + input bug ([#567](https://github.com/dhis2/dashboards-app/issues/567)) ([751cbc4](https://github.com/dhis2/dashboards-app/commit/751cbc4f6a959fd06ac2894354621f71935ed667))
* formatting ([#714](https://github.com/dhis2/dashboards-app/issues/714)) ([356a3a6](https://github.com/dhis2/dashboards-app/commit/356a3a64036ecd767d8ad93a7b46596064952a09))
* hide current vis type as option in 'view as' (DHIS2-8400) ([#616](https://github.com/dhis2/dashboards-app/issues/616)) ([38ae5fc](https://github.com/dhis2/dashboards-app/commit/38ae5fc9c617dc8a263090adb2599f9e4c709246))
* hide scrollbar for chart items ([#337](https://github.com/dhis2/dashboards-app/issues/337)) ([a3b8848](https://github.com/dhis2/dashboards-app/commit/a3b88484b5ce41adf62628b480a585c94675d46b))
* hide titles for maps (DHIS2-8616) ([#718](https://github.com/dhis2/dashboards-app/issues/718)) ([2449234](https://github.com/dhis2/dashboards-app/commit/244923434bdcaf8ab0e4d55186468c310ed6761b))
* hide vis action buttons for single value charts ([#336](https://github.com/dhis2/dashboards-app/issues/336)) ([b42812a](https://github.com/dhis2/dashboards-app/commit/b42812ac9a3d730d3f2c8956cee1d13dfaf7acfc))
* interpretation comments delete DHIS2-8299 ([#541](https://github.com/dhis2/dashboards-app/issues/541)) ([6d2b568](https://github.com/dhis2/dashboards-app/commit/6d2b568e33ba158374aa14ee40a3049288ddbcee))
* List items not appearing to get added in edit mode (DHIS2-8567) ([#699](https://github.com/dhis2/dashboards-app/issues/699)) ([e06c4da](https://github.com/dhis2/dashboards-app/commit/e06c4daa5d7b44430ce6ebe5052afb1ab722a2bb))
* make dashboard items draggable again by passing down event props ([#523](https://github.com/dhis2/dashboards-app/issues/523)) ([86d7d3e](https://github.com/dhis2/dashboards-app/commit/86d7d3efec9964c497a4f0a0787312c2c3e31c3e))
* Pass correct style prop to chart plugin on resize & update snapshots ([#299](https://github.com/dhis2/dashboards-app/issues/299)) ([07c6dec](https://github.com/dhis2/dashboards-app/commit/07c6dec68a13dab8c7cdd67a3858b58aa37a2861))
* pie tooltip DHIS2-7532 ([#349](https://github.com/dhis2/dashboards-app/issues/349)) ([fab7ab8](https://github.com/dhis2/dashboards-app/commit/fab7ab86e7380ce82fad9af4452e4851ae0e534a))
* plugin@34.3.9 ([#593](https://github.com/dhis2/dashboards-app/issues/593)) ([6119bf2](https://github.com/dhis2/dashboards-app/commit/6119bf268e2bfc977fa0155e715cf76a6dbfe2ed))
* prop types warnings DHIS2-8334 ([#569](https://github.com/dhis2/dashboards-app/issues/569)) ([381ce06](https://github.com/dhis2/dashboards-app/commit/381ce0699d1524535731c1c50d3423710bc6d29d))
* remove unused dependency [TECH-316] ([#665](https://github.com/dhis2/dashboards-app/issues/665)) ([3a8e1a7](https://github.com/dhis2/dashboards-app/commit/3a8e1a733174ff5bd6ce8227cc3c42def53753f2))
* removes the 'view as' menu from gauge and pie ([#615](https://github.com/dhis2/dashboards-app/issues/615)) ([fd57417](https://github.com/dhis2/dashboards-app/commit/fd57417274d632ea106eede60e121c87c5e5f212))
* request program stage for dimensions ([#346](https://github.com/dhis2/dashboards-app/issues/346)) ([0d00250](https://github.com/dhis2/dashboards-app/commit/0d00250ef8b7bed0a84037002e5d85a9bf7b2e1c))
* return the right url based on the report type ([#732](https://github.com/dhis2/dashboards-app/issues/732)) ([c707e93](https://github.com/dhis2/dashboards-app/commit/c707e93cef239f634d157bc77aee9ac0946a84f6))
* revert some css module changes and fix missing units ([#715](https://github.com/dhis2/dashboards-app/issues/715)) ([123c31d](https://github.com/dhis2/dashboards-app/commit/123c31d015bbf2eb9ee9a38c9d575bfa4fc5a5ac))
* set filter badge top position based on offset height ([#301](https://github.com/dhis2/dashboards-app/issues/301)) ([70f248c](https://github.com/dhis2/dashboards-app/commit/70f248c248d364c02f3edc87069e1b07326764f5))
* set focus properties so textfield maintains focus when popover opens ([#297](https://github.com/dhis2/dashboards-app/issues/297)) ([771854e](https://github.com/dhis2/dashboards-app/commit/771854eba64f0dceff837bd85b6e19af9878a5bf))
* set font-weight to 700 according to spec ([#618](https://github.com/dhis2/dashboards-app/issues/618)) ([e48e080](https://github.com/dhis2/dashboards-app/commit/e48e080503d77db3601f426ca838314dc9c54073))
* update analytics/dv plugin dependencies ([#339](https://github.com/dhis2/dashboards-app/issues/339)) ([8796bb4](https://github.com/dhis2/dashboards-app/commit/8796bb46fe4fd03b0a2d2cc31c030af2655bd3be))
* update dep for rich text parser fix ([#320](https://github.com/dhis2/dashboards-app/issues/320)) ([875e9ec](https://github.com/dhis2/dashboards-app/commit/875e9ec233be7ecfdeecebbcdfc53189dccbe552))
* update plugin dep ([d837d8c](https://github.com/dhis2/dashboards-app/commit/d837d8c2fd1f475340605230890315a6a1829437))
* update plugin dep ([#661](https://github.com/dhis2/dashboards-app/issues/661)) ([febe988](https://github.com/dhis2/dashboards-app/commit/febe988877a8cf90f4bae99017cc47687cb9d00b))
* updated dv-plugin for latest legend features ([#570](https://github.com/dhis2/dashboards-app/issues/570)) ([ae5c95f](https://github.com/dhis2/dashboards-app/commit/ae5c95f9264e07b19f4d0aa51f4abddf160508a8))
* upgrade analytics so no ui-core mismatch ([#564](https://github.com/dhis2/dashboards-app/issues/564)) ([f154dbb](https://github.com/dhis2/dashboards-app/commit/f154dbb3024690c4d7d21f178697fafd5ccca48a))
* upgrade app-runtime-adapter-d2 to fix missing sharing translations ([#1016](https://github.com/dhis2/dashboards-app/issues/1016)) ([a0841ae](https://github.com/dhis2/dashboards-app/commit/a0841aee84574dfaa9815a4c6e71df2f9b766010))
* upgrade d2 to 31.8.1 ([#619](https://github.com/dhis2/dashboards-app/issues/619)) ([0671e1d](https://github.com/dhis2/dashboards-app/commit/0671e1d27f1fffc3977d1771f2030d217a0707ed))
* upgrade data-visualizer-plugin to 34.2.5 ([#566](https://github.com/dhis2/dashboards-app/issues/566)) ([1ccbd66](https://github.com/dhis2/dashboards-app/commit/1ccbd661903dca1eaf4d78a73f050e73776b4a7f))
* upgrade DV plugin for single value support ([#332](https://github.com/dhis2/dashboards-app/issues/332)) ([0b643c7](https://github.com/dhis2/dashboards-app/commit/0b643c701cd9a01c3a6c6e43bd9d8a9ecad6da2e))
* upgrade dv plugin to v34.3.28 ([#623](https://github.com/dhis2/dashboards-app/issues/623)) ([6e9f30a](https://github.com/dhis2/dashboards-app/commit/6e9f30a32ed3cfbc3889836700d1b08f7cd1bc02))
* upgrade plugin@34.3.26 ([#620](https://github.com/dhis2/dashboards-app/issues/620)) ([6ac468b](https://github.com/dhis2/dashboards-app/commit/6ac468bb82edbd1dd920ae2fae1736f45fd80f0a))
* upgrade ui-widgets to 2.1.1 for proper translations ([#851](https://github.com/dhis2/dashboards-app/issues/851)) ([47e098a](https://github.com/dhis2/dashboards-app/commit/47e098a7f085c44821a4d0519f587fc330d5e0ab))
* use measured height of dashboard item in view mode [DHIS2-8492] ([#674](https://github.com/dhis2/dashboards-app/issues/674)) ([09658e3](https://github.com/dhis2/dashboards-app/commit/09658e3ca9f63acf13965e4224c50156284630f3))
* use the new visualizations api ([#591](https://github.com/dhis2/dashboards-app/issues/591)) ([a89c1cb](https://github.com/dhis2/dashboards-app/commit/a89c1cb9dd0a5eeb55bd3eaa766a0787ab8a1f8f))
* use ui alertbar instead of material-ui ([#1149](https://github.com/dhis2/dashboards-app/issues/1149)) ([6fb0c99](https://github.com/dhis2/dashboards-app/commit/6fb0c992c0d29c4bb0e06087a670806f1984661a))
* wrap VisPlugin with Fatal error boundary ([#621](https://github.com/dhis2/dashboards-app/issues/621)) ([1388a8d](https://github.com/dhis2/dashboards-app/commit/1388a8dd42068a4246ccb09318f45285548199b1))
* **filters:** dimension items selection ([#278](https://github.com/dhis2/dashboards-app/issues/278)) ([8344c4a](https://github.com/dhis2/dashboards-app/commit/8344c4ae4cc9fb5d9727fe4a088ea06ce071f946))
* **filters:** filter the list of dimensions usable as filters ([#287](https://github.com/dhis2/dashboards-app/issues/287)) ([6569200](https://github.com/dhis2/dashboards-app/commit/6569200b5e456b767f28a0b3465cb8cf3112f971))
* **filters:** wrap badges + clear/disable filters on dashboard switch and edit mode ([#280](https://github.com/dhis2/dashboards-app/issues/280)) ([ad3e3c3](https://github.com/dhis2/dashboards-app/commit/ad3e3c3c3ad14bcf36c86ebb5063c6346cbc63c6))
* **styles:** fix styles for filter selector ([#308](https://github.com/dhis2/dashboards-app/issues/308)) ([3da2b30](https://github.com/dhis2/dashboards-app/commit/3da2b30602c36d9a9d8cde1fd8ef2df240a0e025))
* **TextItem:** use all the vertical space for the input ([#283](https://github.com/dhis2/dashboards-app/issues/283)) ([9419d28](https://github.com/dhis2/dashboards-app/commit/9419d281f477ce61b75352f1d1ef7ef1c152b0a3))


### Features

* add support for multi root ou in filters ([#345](https://github.com/dhis2/dashboards-app/issues/345)) ([31dd611](https://github.com/dhis2/dashboards-app/commit/31dd6113a386d2ca532b5e295858ea0e875bfd72))
* buffer while scrolling with progressive loading. ([#273](https://github.com/dhis2/dashboards-app/issues/273)) ([7bea49b](https://github.com/dhis2/dashboards-app/commit/7bea49ba368bec7534d9809ef4f35d01993f7639))
* condense item header options into a single menu ([#568](https://github.com/dhis2/dashboards-app/issues/568)) ([993981b](https://github.com/dhis2/dashboards-app/commit/993981bb9bfd9c843859dfdbca2e624697d08a50))
* dashboards filters ([#275](https://github.com/dhis2/dashboards-app/issues/275)) ([bc22817](https://github.com/dhis2/dashboards-app/commit/bc2281766f4f40e4ffe5526c3c7b547d28f857a8))
* Enable epi-weekly periods in filter ([#331](https://github.com/dhis2/dashboards-app/issues/331)) ([c3d6afc](https://github.com/dhis2/dashboards-app/commit/c3d6afc8b465617f22d598ae2e71030d152fa102))
* fetch items chart data on app level ([#271](https://github.com/dhis2/dashboards-app/issues/271)) ([a2e3e94](https://github.com/dhis2/dashboards-app/commit/a2e3e946c416a028ad9fc8de46d541abb28599df))
* implements latest Dynamic Dimension selector from Analytics (DHIS2-8831) ([#885](https://github.com/dhis2/dashboards-app/issues/885)) ([f878995](https://github.com/dhis2/dashboards-app/commit/f878995c515aaac157511fed3605ebbf6e030a40)), closes [dhis2/data-visualizer-app#1046](https://github.com/dhis2/data-visualizer-app/issues/1046)
* implements latest Period Selector from Analytics (DHIS2-8807) ([#872](https://github.com/dhis2/dashboards-app/issues/872)) ([886ccce](https://github.com/dhis2/dashboards-app/commit/886cccede5b474cfc72b2df56020410bad32d544))
* print dashboard [DHIS2-7045] ([#1015](https://github.com/dhis2/dashboards-app/issues/1015)) ([20cb64f](https://github.com/dhis2/dashboards-app/commit/20cb64fffd165c2f4740d51333d5933b536317f6))
* progressive dashboard loading ([#244](https://github.com/dhis2/dashboards-app/issues/244)) ([19bd63b](https://github.com/dhis2/dashboards-app/commit/19bd63b5f8f0774bd1e7233d82c5e54eca56754e))
* Show "more button" disabled instead of hiding it ([#323](https://github.com/dhis2/dashboards-app/issues/323)) ([28396c3](https://github.com/dhis2/dashboards-app/commit/28396c3adb243254e93246a3258cd321b9c002bf))
* upgrade to ui@5 (TECH-385) ([#891](https://github.com/dhis2/dashboards-app/issues/891)) ([d551b81](https://github.com/dhis2/dashboards-app/commit/d551b81d0126b71bf85f56f65f064cde5bf8ee46)), closes [dhis2/analytics#476](https://github.com/dhis2/analytics/issues/476)
* use the new visualizations type instead of report tables and charts ([#540](https://github.com/dhis2/dashboards-app/issues/540)) ([8742a6a](https://github.com/dhis2/dashboards-app/commit/8742a6a1704db6ac35fe160f6094ad7954503990))


### Reverts

* remove file inadvertently added to master before its time ([#1264](https://github.com/dhis2/dashboards-app/issues/1264)) ([b6d80f3](https://github.com/dhis2/dashboards-app/commit/b6d80f36b1d42678be55ca64652b77db11a0c4fe))
* Revert "fix: use better spacing in item title when the title wraps to multiple lines (#1099)" (#1112) ([5a0b3b2](https://github.com/dhis2/dashboards-app/commit/5a0b3b2fe9a598b80f50e31dd77bbcaf5ef68c08)), closes [#1099](https://github.com/dhis2/dashboards-app/issues/1099) [#1112](https://github.com/dhis2/dashboards-app/issues/1112)
