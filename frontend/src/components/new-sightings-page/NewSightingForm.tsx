import React, { useState } from "react";
import {
  createSighting,
  CreateSightingRequest,
  Sighting,
  Species,
} from "../../clients/apiClient";
import Select from "react-select";
import { isUndefined } from "util";
import "./NewSightingForm.scss";

interface NewSightingFormProps {
  whaleSpecies?: Species[];
}

export const NewSightingForm: React.FC<NewSightingFormProps> = ({
  whaleSpecies,
}) => {
  const [seenBy, setSeenBy] = useState("");
  const [date, setDate] = useState("");
  const [locationInputType, setLocationInputType] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [speciesId, setSpeciesId] = useState(0);
  const [whaleCount, setWhaleCount] = useState("");
  const [seenByError, setSeenByError] = useState("");
  const [dateError, setDateError] = useState("");
  const [locationInputTypeError, setLocationInputTypeError] = useState("");
  const [latError, setLatError] = useState("");
  const [longError, setLongError] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocationInputType(event.target.value);
  };

  const whaleSpeciesMenu: any[] = [];
  if (whaleSpecies !== undefined) {
    whaleSpecies.forEach((species, index) => {
      whaleSpeciesMenu.push({ value: species.id, label: species.name }); // use id to retrieve the species!
    });
  }

  const validateForm = () => {
    let numberOfErrors = 0;
    setSeenByError("");
    setDateError("");
    setLocationInputTypeError("");
    setLatError("");
    setLongError("");
    setImageUrl("");

    if (seenBy === "") {
      setSeenByError("Please enter a seenBy");
      numberOfErrors++;
    }
    if (date === "") {
      setDateError("Please enter date");
      numberOfErrors++;
    }
    if (locationInputType === "") {
      setLocationInputTypeError("Please select a way to input your location");
      numberOfErrors++;
    } else {
      if (latitude === "") {
        setLatError("Please enter a latitude");
        numberOfErrors++;
      }
      if (longitude === "") {
        setLongError("Please enter a longitude");
        numberOfErrors++;
      }
    }
    if (imageUrl && imageUrl.includes(" ")) {
      setImageUrl("URL cannot contain spaces");
      numberOfErrors++;
    }

    return numberOfErrors;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateForm() === 0) {
      const createSightingRequest: CreateSightingRequest = {
        seenBy: seenBy,
        seenOn: date,
        speciesId: speciesId,
        imageUrl: imageUrl,
        description: description,
        whaleCount: Number.parseInt(whaleCount),
        latitude: Number.parseFloat(latitude),
        longitude: Number.parseFloat(longitude),
      };
      createSighting(createSightingRequest);
    }
  };

  return (
    <>
      <h1>Whale Spotting</h1>
      <p>Spot whales!</p>
      <form className="new-sighting-form" method="post" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => {
            setSeenBy(e.target.value);
          }}
        />
        {seenByError !== "" ? { seenByError } : <></>}

        <input
          type="datetime-local"
          onChange={(e) => {
            setDate(e.target.value);
          }}
        />
        {dateError !== "" ? { dateError } : <></>}

        <fieldset className="location-input-choices">
          <legend>Choose how to input your location:</legend>
          <input
            type="radio"
            value="automatic"
            checked={locationInputType === "automatic"}
            onChange={handleChange}
            disabled
          />
          Use my location
          <br />
          <input
            type="radio"
            value="manual"
            checked={locationInputType === "manual"}
            onChange={handleChange}
          />{" "}
          Enter latitude and longitude
          <br />
          {locationInputType === "manual" && (
            <div className="lat-and-long-inputs">
              <input
                type="number"
                placeholder="Latitude"
                min="-90"
                max="90"
                onChange={(e) => {
                  setLatitude(e.target.value);
                }}
              />
              {latError !== "" ? { latError } : <></>}
              <input
                type="number"
                placeholder="Longitude"
                min="-180"
                max="180"
                onChange={(e) => {
                  setLongitude(e.target.value);
                }}
              />
              {longError !== "" ? { longError } : <></>}
            </div>
          )}
          <input
            type="radio"
            value="autocomplete"
            checked={locationInputType === "autocomplete"}
            onChange={handleChange}
            disabled
          />
          Start typing a location
          {locationInputTypeError !== "" ? { locationInputTypeError } : <></>}
        </fieldset>

        {whaleSpecies !== undefined ? (
          <Select
            onChange={(e) => {
              setSpeciesId(e.value);
            }}
            options={whaleSpeciesMenu}
          />
        ) : (
          <p>Loading...</p>
        )}

        <input
          type="number"
          placeholder="Number of whales"
          step="1"
          onChange={(e) => {
            setWhaleCount(e.target.value);
          }}
        />

        <input
          type="text"
          placeholder="Description"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />

        <input
          type="text"
          placeholder="Image Url"
          onChange={(e) => {
            setImageUrl(e.target.value);
          }}
        />

        <button type="submit">Submit sighting</button>
      </form>
    </>
  );
};
