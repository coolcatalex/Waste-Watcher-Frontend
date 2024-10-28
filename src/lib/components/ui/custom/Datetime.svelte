<script lang="ts">
    import { DatePicker } from '@svelte-plugins/datepicker';
    import { format, parse } from 'date-fns'; // Include parse to handle manual input
    import Input from '../input/input.svelte';

    export let startDate: Date;
    let dateFormat = 'dd/MM/yyyy';
    let isOpen = false;

    const toggleDatePicker = () => (isOpen = !isOpen);

    // Format the date into the desired format
    const formatDate = (date: Date) => {
        return date ? format(new Date(date), dateFormat) : '';
    };

    // This will be the formatted date shown in the input
    let formattedStartDate = formatDate(startDate);
    const dateRegx = /\d{2}\/\d{2}\/\d{4}/
    // Reformat whenever the startDate changes
    $: formattedStartDate = formatDate(startDate);

    // Function to handle user input and update the start date if valid
    const handleInputChange = (e: Event) => {
        const inputDate = (e.target as HTMLInputElement).value;
        const parsedDate = parse(inputDate, dateFormat, new Date());

        if(dateRegx.test(inputDate)){
            if (!isNaN(parsedDate.getTime())) {
                startDate = parsedDate; // Update the date only if it's valid
            }
        }
    };
</script>

<!-- DatePicker to select the date from calendar -->
<DatePicker bind:isOpen bind:startDate showTimePicker>
    <Input
        type="text"
        placeholder="Select date"
        value={formattedStartDate}
        on:click={toggleDatePicker}
        on:input={handleInputChange} 
    />
</DatePicker>
