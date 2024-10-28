<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js";
  import { Input } from "$lib/components/ui/input/index";
  import * as Select from "$lib/components/ui/select";
  import { onMount } from "svelte";

  // Reactive variables
  let cus_distance: number | null = null;
  let cus_distance_units = "m";
  let cus_s: number | null = null;
  let cus_s_units = "m";
  let cus_age: number | null = null;
  let cus_ans = "";

  // Function to convert units
  function convertUnits(value: number, fromUnit: string, toUnit: string): number {
      let valueInMeters;

      switch (fromUnit) {
          case 'm':
              valueInMeters = value;
              break;
          case 'cm':
              valueInMeters = value / 100;
              break;
          case 'foot':
              valueInMeters = value * 0.3048;
              break;
          case 'in':
              valueInMeters = value * 0.0254;
              break;
          default:
              throw new Error('Unsupported unit: ' + fromUnit);
      }

      switch (toUnit) {
          case 'm':
              return valueInMeters;
          case 'cm':
              return valueInMeters * 100;
          case 'foot':
              return valueInMeters / 0.3048;
          case 'in':
              return valueInMeters / 0.0254;
          default:
              throw new Error('Unsupported unit: ' + toUnit);
      }
  }

  // Function to calculate the answer
  function calculate() {
      try {
          if (cus_distance !== null && cus_s !== null && cus_age !== null) {
              const distanceInMeters = convertUnits(cus_distance, cus_distance_units, "m");
              const screenSizeInMeters = convertUnits(cus_s, cus_s_units, "m");
              var _tmpcus_age = 40
              if(cus_age > 40)_tmpcus_age = cus_age
              
              const ans = (10 + 3.5 * (distanceInMeters / screenSizeInMeters)) * (1 + 0.01 * (_tmpcus_age - 40));
              cus_ans = `Answer is: ${ans.toFixed(2)}`;
          } else {
              cus_ans = "";
          }
      } catch (error) {
          console.error("Error calculating:", error);
      }
  }
</script>
<div class="h-full flex justify-center items-center">
  <section class="grid grid-cols gap-6 justify-center items-center w-2/5 mx-auto h-fit">
    <div>
        <Label for="cus_distance" class="text-sm font-medium">Distance</Label>
        <div class="flex gap-2">
            <Input id="cus_distance" placeholder="Distance" type="number" bind:value={cus_distance} on:input={calculate} />
            <Select.Root onSelectedChange={(_d)=>{
              // @ts-ignore
              cus_distance_units = _d?.value
              calculate()
            }} selected={{
                value: "m",
                label: "Meter"
            }}>
                <Select.Trigger class="border border-dashed border-gray-300 rounded px-2 py-1">
                    <Select.Value placeholder="Specify unit">{cus_distance_units}</Select.Value>
                </Select.Trigger>
                <Select.Content>
                    <Select.Item value="m">Meter</Select.Item>
                    <Select.Item value="cm">Centimeter</Select.Item>
                    <Select.Item value="foot">Foot</Select.Item>
                    <Select.Item value="in">Inch</Select.Item>
                </Select.Content>
            </Select.Root>
        </div>
    </div>
    <div>
        <Label for="cus_s" class="text-sm font-medium">Screen Size (Diagonally)</Label>
        <div class="flex gap-2">
            <Input id="cus_s" type="number" placeholder="Screen Size" bind:value={cus_s} on:input={calculate} />
            <Select.Root onSelectedChange={(_d)=>{
              // @ts-ignore
              cus_s_units = _d?.value
              calculate()
            }} selected={{
                value: "m",
                label: "Meter"
            }}>
                <Select.Trigger class="border border-dashed border-gray-300 rounded px-2 py-1">
                    <Select.Value placeholder="Specify unit">{cus_s_units}</Select.Value>
                </Select.Trigger>
                <Select.Content>
                    <Select.Item value="m">Meter</Select.Item>
                    <Select.Item value="cm">Centimeter</Select.Item>
                    <Select.Item value="foot">Foot</Select.Item>
                    <Select.Item value="in">Inch</Select.Item>
                </Select.Content>
            </Select.Root>
        </div>
    </div>
    <div class="col-span-2">
        <Label for="cus_age" class="text-sm font-medium">Age</Label>
        <div>
            <Input id="cus_age" type="number" placeholder="Age" bind:value={cus_age} on:input={calculate} />
        </div>
    </div>
    <div class="w-full text-center col-span-2">
        <Label for="cus_ans" class="font-semibold text-xl">{cus_ans}</Label>
    </div>
  </section>
</div>
