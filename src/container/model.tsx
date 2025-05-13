export interface Product {
    id: number;
    name: string;
    deliveryCharge: number;
}

export interface PostcodeResult {
    status: number;
    result: PostcodeDetails;
}

export interface PostcodeDetails {
    postcode: string;
    quality: number;
    eastings: number;
    northings: number;
    country: string;
    nhsHa: string | null;
    longitude: number;
    latitude: number;
    europeanElectoralRegion: string | null;
    primaryCareTrust: string | null;
    region: string;
    lsoa: string;
    msoa: string;
    incode: string;
    outcode: string;
    parliamentaryConstituency: string | null;
    parliamentaryConstituency2024: string | null;
    adminDistrict: string | null;
    parish: string;
    adminCounty: string | null;
    dateOfIntroduction: string | null;
    adminWard: string | null;
    ced: string | null;
    ccg: string;
    nuts: string;
    pfa: string;
    codes: Codes;
}

export interface Codes {
    adminDistrict: string | null;
    adminCounty: string | null;
    adminWard: string | null;
    parish: string;
    parliamentaryConstituency: string | null;
    parliamentaryConstituency2024: string | null;
    ccg: string;
    ccgId: string | null;
    ced: string;
    nuts: string;
    lsoa: string;
    msoa: string;
    lau2: string;
    pfa: string;
}
