/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       18 Oct 2018     idor
 *
 */

/**
 * @param {String}
 *            type Context Types: scheduled, ondemand, userinterface, aborted,
 *            skipped
 * @returns {Void}
 */
function deleteVendors(type) {

	var results = [

	'3433', '3438', '2014', '2015', '2016', '2017', '2018', '2019', '2020',
			'2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028',
			'2029', '2030', '2031', '2032', '2033', '2034', '2035', '2036',
			'2037', '2038', '2039', '2040', '2041', '2042', '2043', '2044',
			'2045', '2110', '2111', '2112', '2113', '2210', '2211', '2212',
			'2213', '2214', '2215', '2216', '2217', '2218', '2219', '2220',
			'2221', '2222', '2223', '2224', '2225', '2226', '2227', '2228',
			'2229', '2230', '2231', '2232', '2233', '2234', '2235', '2236',
			'2237', '2238', '2239', '2240', '2241', '2242', '2243', '2244',
			'2245', '2246', '2247', '2248', '2249', '2250', '2251', '2252',
			'2253', '2254', '2255', '2256', '2257', '2258', '2259', '2260',
			'2261', '2262', '2263', '2264', '2265', '2266', '2267', '2268',
			'2269', '2270', '2271', '2272', '2273', '2274', '2275', '2276',
			'2277', '2278', '2279', '2310', '2311', '2312', '2313', '2314',
			'2315', '2316', '2317', '2318', '2319', '2320', '2321', '2322',
			'2323', '2324', '2325', '2326', '2327', '2328', '2329', '2330',
			'2331', '2332', '2333', '2334', '2335', '2336', '2337', '2338',
			'2339', '2340', '2341', '2342', '2343', '2344', '2345', '2346',
			'2347', '2348', '2349', '2350', '2351', '2352', '2353', '2354',
			'2355', '2356', '2357', '2358', '2359', '2360', '2361', '2362',
			'2363', '2364', '2365', '2366', '2367', '2368', '2369', '2370',
			'2371', '2372', '2373', '2374', '2375', '2376', '2377', '2378',
			'2379', '2380', '2381', '2382', '2383', '2384', '2385', '2386',
			'2387', '2388', '2389', '2390', '2391', '2392', '2393', '2394',
			'2395', '2396', '2397', '2398', '2399', '2400', '2401', '2402',
			'2403', '2404', '2405', '2406', '2407', '2408', '2409', '2410',
			'2411', '2412', '2413', '2414', '2416', '2417', '2418', '2419',
			'2420', '2421', '2422', '2423', '3434', '2424', '2425', '2426',
			'2427', '2428', '2429', '2430', '2431', '2432', '2433', '2434',
			'2435', '2436', '2437', '2438', '2439', '2440', '2441', '2442',
			'2443', '2444', '2445', '2446', '2447', '2448', '2449', '2450',
			'2451', '2452', '2453', '2454', '2455', '2456', '2457', '2458',
			'2459', '2460', '2461', '2462', '2463', '2464', '2465', '2466',
			'2467', '2468', '2469', '2470', '2471', '2472', '2473', '2474',
			'2475', '2476', '2477', '2478', '2479', '2480', '2481', '2482',
			'2483', '2484', '2485', '2486', '2487', '2488', '2489', '2490',
			'2491', '2492', '2493', '2494', '2495', '2496', '2497', '2498',
			'2499', '2500', '2501', '2502', '2503', '2504', '2505', '2506',
			'2507', '2508', '2509', '2510', '2511', '2512', '2513', '2514',
			'2515', '2516', '2517', '2518', '2519', '2520', '2521', '2522',
			'2523', '2524', '2525', '3436', '2526', '2527', '2528', '2529',
			'2530', '2531', '2532', '2533', '2534', '2535', '2536', '2538',
			'2539', '2540', '2541', '2542', '2543', '2544', '2545', '2546',
			'2547', '2548', '2549', '2550', '2551', '2552', '2553', '2554',
			'2555', '2556', '2557', '2558', '3432', '2559', '2560', '2561',
			'2562', '2563', '2564', '2565', '2566', '2567', '3429', '2569',
			'2570', '2571', '2572', '2573', '2574', '2575', '2576', '2577',
			'2578', '2579', '2580', '2581', '2582', '2583', '2584', '2585',
			'2586', '2587', '2588', '2589', '2590', '2591', '2592', '2593',
			'2594', '2595', '2596', '2597', '2598', '2599', '2600', '2601',
			'2602', '2603', '2604', '2605', '2606', '2607', '2608', '2609',
			'2610', '2611', '2612', '2613', '2614', '2615', '2616', '2617',
			'2618', '2619', '2620', '2621', '2622', '2623', '2624', '2625',
			'2626', '2627', '2628', '2629', '2630', '2631', '2632', '2633',
			'2634', '2635', '2636', '2637', '2638', '2639', '2640', '2641',
			'2642', '2643', '2644', '2645', '2646', '2647', '2648', '2649',
			'2650', '2651', '2652', '2653', '2654', '2655', '2656', '2657',
			'2658', '2659', '2660', '2661', '2662', '2663', '2664', '2665',
			'2666', '2667', '2668', '2669', '2670', '2671', '2672', '2673',
			'2674', '2675', '2676', '2677', '2678', '2679', '2680', '2681',
			'2682', '2683', '2684', '2685', '2686', '2687', '2688', '2689',
			'2690', '3439', '2691', '2692', '2693', '2694', '2695', '2696',
			'2697', '2698', '2699', '2700', '2701', '2702', '2703', '2704',
			'2705', '2706', '2707', '2708', '2709', '2710', '2711', '2712',
			'2713', '2714', '2715', '2716', '2717', '2718', '2719', '2720',
			'2721', '2722', '2723', '2724', '2725', '2726', '2727', '2728',
			'2729', '2730', '2731', '2732', '2733', '2734', '2735', '2736',
			'2737', '2738', '2739', '2740', '2741', '2742', '2743', '2744',
			'2745', '2746', '2747', '2748', '2749', '2750', '2751', '2752',
			'2753', '2754', '2755', '2756', '2757', '2758', '2759', '2760',
			'2761', '2762', '2763', '2764', '2765', '2766', '2767', '2768',
			'2769', '2770', '2771', '2772', '2773', '2774', '2775', '2776',
			'2777', '2778', '2779', '2780', '2781', '2782', '2783', '2784',
			'2785', '2786', '2787', '2788', '2789', '2790', '2791', '2792',
			'2793', '2794', '2795', '2796', '2797', '2798', '3431', '2799',
			'2800', '2801', '2802', '2803', '2804', '2805', '2806', '2807',
			'2808', '2809', '2810', '2811', '2812', '2813', '2814', '2815',
			'2816', '2817', '2818', '2819', '2820', '2821', '2822', '2824',
			'2825', '2826', '2827', '2828', '2829', '2830', '2831', '2832',
			'2833', '2834', '2835', '2836', '2837', '2838', '2839', '2840',
			'2841', '2842', '2843', '2844', '2845', '2846', '2847', '2848',
			'2849', '2850', '2851', '2852', '2853', '2854', '2855', '2856',
			'2857', '2858', '2859', '2860', '2861', '2862', '2863', '2864',
			'2865', '2866', '2867', '2868', '2869', '2870', '2871', '2872',
			'2873', '2874', '2875', '2876', '2877', '2878', '2879', '2880',
			'2881', '2882', '2883', '2884', '2885', '2886', '2887', '2888',
			'2889', '2890', '2891', '2892', '2893', '2894', '2895', '2896',
			'2897', '2898', '2899', '2900', '2901', '2902', '2903', '2904',
			'2905', '2906', '2907', '2908', '2909', '2910', '2911', '2912',
			'3435', '3428', '2913', '2914', '2915', '2916', '2917', '3427',
			'2918', '2919', '2920', '2921', '2922', '2923', '2924', '2925',
			'2926', '2927', '2928', '2929', '2930', '2931', '2932', '2933',
			'2934', '2935', '2936', '2937', '2938', '2939', '2940', '2941',
			'2942', '2943', '2944', '2945', '2947', '2948', '2949', '2950',
			'2951', '2952', '2953', '2954', '2955', '2956', '2957', '2958',
			'2959', '2960', '2961', '2962', '2963', '2964', '2965', '2966',
			'2967', '2968', '2969', '2970', '2971', '2972', '2973', '2974',
			'2975', '2976', '2977', '2978', '2979', '2980', '2981', '2982',
			'2983', '2984', '2985', '2986', '2987', '2988', '2989', '3437',
			'2990', '2991', '2992', '2993', '2994', '2995', '2996', '2997',
			'2998', '2999', '3000', '3001', '3002', '3003', '3004', '3005',
			'3006', '3007', '3008', '3009', '3010', '3011', '3012', '3013',
			'3014', '3016', '3017', '3018', '3019', '3020', '3021', '3022',
			'3023', '3024', '3025', '3026', '3027', '3028', '3029', '3030',
			'3031', '3032', '3033', '3034', '3035', '3036', '3037', '3038',
			'3039', '3040', '3041', '3042', '3043', '3044', '3045', '3046',
			'3047', '3048', '3049', '3050', '3051', '3052', '3053', '3054',
			'3055', '3056', '3057', '3058', '3059', '3060', '3061', '3062',
			'3063', '3064', '3065', '3066', '3067', '3068', '3069', '3071',
			'3072', '3073', '3074', '3075', '3076', '3077', '3078', '3079',
			'3080', '3081', '3082', '3083', '3084', '3085', '3086', '3087',
			'3312', '3314', '3088', '3089', '3090', '3091', '3092', '3093',
			'3094', '3095', '3096', '3097', '3098', '3099', '3100', '3101',
			'3102', '3103', '3104', '3105', '3106', '3107', '3108', '3109',
			'3110', '3111', '3112', '3113', '3114', '3115', '3116', '3117',
			'3118', '3119', '3120', '3121', '3122', '3123', '3124', '3126',
			'3127', '3128', '3129', '3130', '3131', '3132', '3133', '3134',
			'3135', '3136', '3137', '3138', '3139', '3140', '3141', '3142',
			'3143', '3144', '3145', '3146', '3147', '3148', '3149', '3150',
			'3151', '3152', '3153', '3154', '3155', '3156', '3157', '3158',
			'3159', '3161', '3162', '3163', '3164', '3165', '3166', '3167',
			'3168', '3169', '3170', '3171', '3172', '3173', '3174', '3175',
			'3176', '3177', '3178', '3179', '3180', '3181', '3183', '3184',
			'3185', '3186', '3187', '3188', '3189', '3190', '3191', '3192',
			'3193', '3194', '3195', '3196', '3197', '3198', '3199', '3200',
			'3201', '3202', '3203', '3204', '3205', '3206', '3207', '3208',
			'3209', '3210', '3211', '3212', '3213', '3214', '3215', '3216',
			'3217', '3218', '3219', '3220', '3440', '3221', '3222', '3223',
			'3224', '3225', '3226', '3227', '3228', '3229', '3230', '3231',
			'3232', '3233', '3234', '3235', '3236', '3237', '3238', '3239',
			'3240', '3241', '3243', '3244', '3245', '3246', '3247', '3248',
			'3249', '3250', '3251', '3252', '3253', '3254', '3255', '3256',
			'3257', '3258', '3259', '3260', '3261', '3262', '3263', '3264',
			'3265', '3266', '3267', '3268', '3269', '3270', '3271', '3272',
			'3273', '3274', '3275', '3276', '3277', '3278', '3279', '3280',
			'3282', '3283', '3284', '3285', '3286', '3287', '3288'

	]

	for (var i = 0; i < results.length; i++) {

		var ctx = nlapiGetContext();
		var remainingUsage = ctx.getRemainingUsage();
		nlapiLogExecution('debug', 'checking - getRemainingUsage',
				remainingUsage)

		if (remainingUsage < 200) {
			var state = nlapiYieldScript();
			if (state.status == 'FAILURE') {
				nlapiLogExecution('ERROR', 'Error',
						' Failed to yeild delete vendors scheduled');
			} else if (state.status == 'RESUME') {
				nlapiLogExecution("AUDIT", 'delete vendors',
						"Resuming script due to: " + state.reason + ",  "
								+ state.size);
			}
		}
		try {

			var rec = nlapiDeleteRecord('vendor', results[i]);

		} catch (err) {
			nlapiLogExecution('debug', 'err', err);
		}

	}

}
