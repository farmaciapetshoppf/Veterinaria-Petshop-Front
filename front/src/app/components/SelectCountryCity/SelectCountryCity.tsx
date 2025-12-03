import { useField } from 'formik';
import Select from 'react-select';
import { Country, City } from 'country-state-city';

export function CountrySelect({ label, name, onCountryChange }) {
  const [field, meta, helpers] = useField(name);
  
  const countries = Country.getAllCountries().map(country => ({
    value: country.isoCode,
    label: country.name
  }));

  const handleChange = (option) => {
    helpers.setValue(option ? option.label : '');
    if (onCountryChange) {
      onCountryChange(option ? option.value : null);
    }
  };

  return (
    <div className="flex flex-col my-2">
      <label className="text-black mb-1">{label}</label>
      <Select
        options={countries}
        onChange={handleChange}
        placeholder="Selecciona un país"
        isClearable
        className="text-black"
        styles={{
          control: (base) => ({
            ...base,
            borderColor: meta.touched && meta.error ? 'red' : base.borderColor,
          })
        }}
      />
      {meta.touched && meta.error && (
        <span className="text-red-500 text-sm mt-1">{meta.error}</span>
      )}
    </div>
  );
}

export function CitySelect({ label, name, countryCode }) {
  const [field, meta, helpers] = useField(name);
  
  const cities = countryCode 
    ? City.getCitiesOfCountry(countryCode).map(city => ({
        value: city.name,
        label: city.name
      }))
    : [];

  const handleChange = (option) => {
    helpers.setValue(option ? option.value : '');
  };

  return (
    <div className="flex flex-col my-2">
      <label className="text-black mb-1">{label}</label>
      <Select
        options={cities}
        onChange={handleChange}
        placeholder={countryCode ? "Selecciona una ciudad" : "Primero selecciona un país"}
        isClearable
        isDisabled={!countryCode}
        className="text-black"
        styles={{
          control: (base) => ({
            ...base,
            borderColor: meta.touched && meta.error ? 'red' : base.borderColor,
          })
        }}
      />
      {meta.touched && meta.error && (
        <span className="text-red-500 text-sm mt-1">{meta.error}</span>
      )}
    </div>
  );
}