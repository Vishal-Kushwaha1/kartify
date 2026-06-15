import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LucideLocateFixed, MapPin } from "lucide-react";
import { api } from "@/utils/Axios";
import { type NewAddressProps, newAddressSchema } from "@/types/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAddAddressMutation, useDeleteAddressMutation, useGetAddressQuery, useSetDefaultAddressMutation } from "@/redux/address/addressApi";

const LocationPicker = ({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const FlyToLocation = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.flyTo([lat, lng], 16, { animate: true });
  }, [lat, lng, map]);
  return null;
};

const LocateMeButton = ({
  onLocate,
}: {
  onLocate: (lat: number, lng: number) => void;
}) => {
  const map = useMap();

  const handleLocate = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        map.flyTo([coords.latitude, coords.longitude], 16, { animate: true });
        onLocate(coords.latitude, coords.longitude);
      },
      () => toast.error("Location permission denied"),
    );
  };

  return (
    <div className="absolute right-3 top-3 z-1000 pointer-events-auto">
      <Button onClick={handleLocate} variant="outline" size="sm">
        <LucideLocateFixed className="mr-2 h-4 w-4" />
        Use current location
      </Button>
    </div>
  );
};

export const AddAddressPage = () => {
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefault, setSettingDefault] = useState(false)
  const [pinned, setPinned] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  const {data: addresses=[], isLoading} = useGetAddressQuery()
  const [addAddress] = useAddAddressMutation()
  const [deleteAddress] = useDeleteAddressMutation()
  const [setDefaultAddress] = useSetDefaultAddressMutation()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<NewAddressProps>({
    resolver: zodResolver(newAddressSchema),
    defaultValues: { isDefault: false, latitude: 0, longitude: 0 },
  });

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      );
      const data = await res.json();
      const formatted: string = data?.display_name ?? "";
      setPinned({ lat, lng, address: formatted });
      if (formatted) {
        setValue("address", formatted, { shouldValidate: true });
      }
    } catch {
      toast.error("Failed to fetch address");
    }
  };

  const handlePick = async (lat: number, lng: number) => {
    setPinned({ lat, lng, address: "" });
    await reverseGeocode(lat, lng);
    setValue("latitude", lat);
    setValue("longitude", lng);
  };

  const onSubmit = async (values: NewAddressProps) => {
    try {
      setAdding(true);
      await addAddress(values).unwrap()
      reset();
      setPinned(null);
      toast.success("Address saved");
    } catch {
      toast.error("Failed to save address");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setSettingDefault(true)
      setDeletingId(id);
      await deleteAddress(id).unwrap()
      toast.success("Address deleted");
    } catch {
      toast.error("Failed to delete address");
    } finally {
      setDeletingId(null);
      setSettingDefault(false)
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      setSettingDefault(true)
      await setDefaultAddress(id).unwrap()
      toast.success("Default address updated");
    } catch {
      toast.error("Unable to set default");
    }finally{
      setSettingDefault(false)
    }
  };


  return (
    <div className="bg-muted/40 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-medium tracking-tight">
            Add new address
          </h1>
          <p className="text-sm text-muted-foreground">
            Save delivery details and pin a location for faster checkout.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="rounded-xl border bg-background">
            <CardHeader>
              <CardTitle className="text-xl font-medium tracking-tight">
                Pin location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative overflow-hidden rounded-xl border">
                <MapContainer
                  center={[28.6139, 77.209]}
                  zoom={13}
                  className="h-64 w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationPicker onPick={handlePick} />
                  <LocateMeButton onLocate={handlePick} />
                  {pinned && (
                    <>
                      <FlyToLocation lat={pinned.lat} lng={pinned.lng} />
                      <Marker position={[pinned.lat, pinned.lng]} />
                    </>
                  )}
                </MapContainer>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {pinned?.address || "Click on the map to select a location"}
                </div>
              </div>

              <div className="rounded-xl border bg-background px-4 py-3 text-sm text-muted-foreground">
                {pinned ? (
                  <div className=" flex justify-between items-center">
                    <div className="flex gap-4">
                      <span>Lat: {pinned.lat.toFixed(5)}</span>
                      <span>Lng: {pinned.lng.toFixed(5)}</span>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setPinned(null)}
                      disabled={!pinned}
                    >
                      Clear pin
                    </Button>
                  </div>
                ) : (
                  "Select a point to view coordinates."
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border bg-background">
            <CardHeader>
              <CardTitle className="text-xl font-medium tracking-tight">
                Address details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">
                      Address label
                    </label>
                    <Input placeholder="Home" {...register("name")} />
                    {errors.name && (
                      <p className="text-xs text-primary">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">
                      Recipient name
                    </label>
                    <Input
                      placeholder="Full name"
                      {...register("recipientName")}
                    />
                    {errors.recipientName && (
                      <p className="text-xs text-primary">
                        {errors.recipientName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">
                      Phone
                    </label>
                    <Input placeholder="Phone number" {...register("phone")} />
                    {errors.phone && (
                      <p className="text-xs text-primary">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">
                      Country
                    </label>
                    <Input placeholder="Country" {...register("country")} />
                    {errors.country && (
                      <p className="text-xs text-primary">
                        {errors.country.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">
                    Address
                  </label>
                  <Input
                    placeholder="Street, building, area"
                    {...register("address")}
                  />
                  {errors.address && (
                    <p className="text-xs text-primary">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">
                      City
                    </label>
                    <Input placeholder="City" {...register("city")} />
                    {errors.city && (
                      <p className="text-xs text-primary">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">
                      State
                    </label>
                    <Input placeholder="State" {...register("state")} />
                    {errors.state && (
                      <p className="text-xs text-primary">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">
                      Postal code
                    </label>
                    <Input
                      placeholder="Postal code"
                      {...register("postalCode")}
                    />
                    {errors.postalCode && (
                      <p className="text-xs text-primary">
                        {errors.postalCode.message}
                      </p>
                    )}
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border"
                    {...register("isDefault")}
                  />
                  Set as default address
                </label>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="submit"
                    className="bg-primary text-white hover:bg-primary/90"
                    disabled={adding}
                  >
                    {adding ? "Saving..." : "Save address"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      reset();
                      setPinned(null);
                    }}
                  >
                    Clear form
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-xl border bg-background">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-medium tracking-tight">
              Saved addresses
            </CardTitle>
            <Badge
              className="border bg-background text-foreground"
              variant="outline"
            >
              {addresses.length} total
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : addresses.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No saved addresses yet.
              </p>
            ) : (
              <RadioGroup
                value={addresses?.find((a) => a.isDefault)?.id}
                onValueChange={(addressId) => handleSetDefault(addressId)}
                className="space-y-3"
                disabled={settingDefault}
              >
                {addresses.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-xl border p-4 md:flex-row md:items-center md:justify-between"
                  >
                    {/* Left Section */}
                    <div className="flex items-start gap-3">
                      <RadioGroupItem
                        value={item.id}
                        id={item.id}
                        className="mt-1"
                      />

                      <Label htmlFor={item.id} className="cursor-pointer">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">
                              {item.name || "Address"}
                            </p>

                            {item.isDefault && (
                              <Badge variant="outline">Default</Badge>
                            )}
                          </div>

                          <p className="text-sm">
                            {item.recipientName} · {item.phone}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {item.address}, {item.city}, {item.state}{" "}
                            {item.postalCode}
                          </p>
                        </div>
                      </Label>
                    </div>

                    {/* Right Section */}
                    <Button
                      variant="outline"
                      className="bg-primary text-white hover:bg-primary/90"
                      disabled={settingDefault || deletingId === item.id }
                      onClick={() => handleDelete(item.id)}
                    >
                      {deletingId === item.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                ))}
              </RadioGroup>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddAddressPage;
