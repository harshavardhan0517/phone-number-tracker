from flask import Flask, render_template, request, jsonify
import phonenumbers
from phonenumbers import geocoder, carrier
from opencage.geocoder import OpenCageGeocode
from service_data import service_provider
app = Flask(__name__)

Key = "da36e3ef407d4ec58c415b20e7e6c81f"
geo = OpenCageGeocode(Key)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/lookup", methods=["POST"])
def lookup():
    data = request.get_json()
    number = data.get("phone")

    try:
        check_number = phonenumbers.parse(number)

        number_location = geocoder.description_for_number(
            check_number, "en"
        )

        service_provider = carrier.name_for_number(
            check_number, "en"
        )

        query = str(number_location)
        results = geo.geocode(query)

        lat = results[0]['geometry']['lat']
        lng = results[0]['geometry']['lng']

        provider_info = service_provider.get(service_provider)
        return jsonify({
            "location": number_location,
            "carrier": service_provider,
            "latitude": lat,
            "longitude": lng,
            "provider_info": provider_info   
        })

    except Exception as e:
        return jsonify({"error": "Invalid phone number"}), 400



if __name__ == "__main__":
    app.run(debug=True)
