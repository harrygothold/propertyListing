import React from 'react';
import Card from './Card';
import Header from './Header';
import GoogleMap from './GoogleMap';
import data from './data/Data';
import jump from 'jump.js';
import { easeInOutCubic } from './utils/Easing';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      properties: data.properties,
      activeProperty: data.properties[10],
      filterIsVisible: false,
      filterBedrooms: 'any',
      filterProperties: [],
      isFiltering: false
    }
    this.setActiveProperty = this.setActiveProperty.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.filterProperties = this.filterProperties.bind(this);
  }

  handleFilterChange(e) {
    const target = e.target;
    const { value, name } = target;
    this.setState({
      [name]: value
    }, function () {
      this.filterProperties();
    });
  };

  filterProperties() {
    const { properties, filterBedrooms } = this.state;
    const isFiltering = filterBedrooms !== 'any';

    const getFilteredProperties = (properties) => {
      const filteredProperties = [];
      properties.map(property => {
        const { bedrooms } = property;
        const match = bedrooms === parseInt(filterBedrooms) || filterBedrooms === 'any'
        //if match is true, push property to filteredProperyy
        match && filteredProperties.push(property);
      });
      return filteredProperties;
    }

    this.setState({
      filterProperties: getFilteredProperties(properties),
      isFiltering: isFiltering
    })
  }

  toggleFilter(e) {
    e.preventDefault();
    this.setState({
      filterIsVisible: !this.state.filterIsVisible
    })
  }

  setActiveProperty(property, scroll) {
    const { index } = property;
    this.setState({ activeProperty: property });
    //only scroll when click on pin not on card
    if (scroll) {
      const target = `#card-${index}`;
      jump(target, {
        duration: 800,
        easing: easeInOutCubic
      })
    }
  }

  render() {
    const { properties, activeProperty, filterIsVisible } = this.state;
    return (
      <div>
        {/* listings - Start */}
        <div className="listings">

          <Header filterIsVisible={filterIsVisible} toggleFilter={this.toggleFilter} handleFilterChange={this.handleFilterChange} />


          <div className="cards container">
            <div className="cards-list row ">
              {properties.map(property => {
                return <Card key={property.id} property={property} activeProperty={activeProperty} setActiveProperty={this.setActiveProperty} />
              })}
            </div>
          </div>
        </div>
        {/* listings - End */}

        <GoogleMap properties={properties} activeProperty={activeProperty} setActiveProperty={this.setActiveProperty} />
      </div>
    )
  }
}

export default App;